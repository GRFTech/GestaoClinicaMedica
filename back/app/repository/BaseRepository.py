import pickle
import os


# Esta é a CLASSE PAI. Ela contém toda a lógica da Árvore Binária de Busca (ABB)
# e os métodos de persistência (carregar e salvar com pickle), sendo reutilizada por
# todas as entidades (Cidades, Pacientes, Médicos, etc.).
class BaseRepository:
    """
    Classe base que implementa a lógica de persistência e indexação (ABB)
    para todas as entidades do sistema.
    """

    def __init__(self, nome_base, chave_primaria_atributo):
        """
        Inicializa o repositório, configurando caminhos e carregando/reconstruindo o índice.

        :param nome_base: Nome do arquivo (ex: 'cidades', 'pacientes').
        :param chave_primaria_atributo: Nome do atributo que serve como chave primária na classe Model (ex: 'codigo', 'codigo_paciente').
        """
        self.chave_primaria_atributo = chave_primaria_atributo

        # 1. Configuração de Caminho
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.data_dir = os.path.join(base_dir, "data")
        os.makedirs(self.data_dir, exist_ok=True)
        self.nome_arquivo = os.path.join(self.data_dir, f"{nome_base}.dat")

        # 2. Estruturas de Dados
        self.dados = []
        self.raiz = None

        # 3. Carregamento inicial
        self.carregar_dados()
        self.reconstruir_indice()

    # --- Persistência de Dados (Comum a Todos) ---
    def carregar_dados(self):
        """Carrega o vetor de registros self.dados do arquivo binário."""
        if os.path.exists(self.nome_arquivo):
            try:
                with open(self.nome_arquivo, 'rb') as f:
                    self.dados = pickle.load(f)
            except Exception as e:
                # Ocorre se o arquivo estiver corrompido ou vazio (menos comum)
                print(f"[ERRO] Falha ao carregar {self.nome_arquivo}: {e}")
                self.dados = []
        else:
            print(f"[INFO] {self.nome_arquivo} não encontrado, iniciando base vazia.")

    def salvar_dados(self):
        """Salva o vetor de registros self.dados de volta no arquivo binário."""
        with open(self.nome_arquivo, 'wb') as f:
            pickle.dump(self.dados, f)

    # --- Lógica da Árvore Binária de Busca (ABB) (Comum a Todos) ---
    def _get_chave_do_registro(self, registro):
        """Acessa a chave primária do objeto de forma dinâmica."""
        return getattr(registro, self.chave_primaria_atributo)

    def _inserir_no_arvore(self, no_atual, chave, rrn):
        """Insere um nó (chave e rrn) na ABB de forma recursiva."""
        if no_atual is None:
            return {'chave': chave, 'rrn': rrn, 'esquerda': None, 'direita': None}
        if chave < no_atual['chave']:
            no_atual['esquerda'] = self._inserir_no_arvore(no_atual['esquerda'], chave, rrn)
        elif chave > no_atual['chave']:
            no_atual['direita'] = self._inserir_no_arvore(no_atual['direita'], chave, rrn)
        # Ignora chaves duplicadas (a validação deve vir da camada Service)
        return no_atual

    def reconstruir_indice(self):
        """Reconstrói a ABB varrendo todos os registros em self.dados."""
        self.raiz = None
        for rrn, registro in enumerate(self.dados):
            if registro is not None:
                chave = self._get_chave_do_registro(registro)
                self.raiz = self._inserir_no_arvore(self.raiz, chave, rrn)

    def _buscar_no_arvore(self, chave):
        """Busca uma chave na ABB e retorna o nó índice (com o RRN)."""
        no_atual = self.raiz
        while no_atual is not None:
            if chave == no_atual['chave']:
                return no_atual
            elif chave < no_atual['chave']:
                no_atual = no_atual['esquerda']
            else:
                no_atual = no_atual['direita']
        return None

    def _buscar_min_valor_no(self, no_atual):
        """Método auxiliar para exclusão na ABB."""
        atual = no_atual
        while atual['esquerda'] is not None:
            atual = atual['esquerda']
        return atual

    def _remover_no_arvore(self, no_atual, chave):
        """Remove um nó da ABB, ajustando a estrutura da árvore."""
        if no_atual is None:
            return no_atual
        if chave < no_atual['chave']:
            no_atual['esquerda'] = self._remover_no_arvore(no_atual['esquerda'], chave)
        elif chave > no_atual['chave']:
            no_atual['direita'] = self._remover_no_arvore(no_atual['direita'], chave)
        else:
            if no_atual['esquerda'] is None:
                return no_atual['direita']
            elif no_atual['direita'] is None:
                return no_atual['esquerda']
            temp = self._buscar_min_valor_no(no_atual['direita'])
            no_atual['chave'] = temp['chave']
            no_atual['rrn'] = temp['rrn']
            no_atual['direita'] = self._remover_no_arvore(no_atual['direita'], temp['chave'])
        return no_atual

    def _in_ordem(self, no_atual, resultados):
        """Percorre a ABB em ordem (In-Ordem) para listar os registros ordenados."""
        if no_atual is not None:
            self._in_ordem(no_atual['esquerda'], resultados)
            rrn = no_atual['rrn']
            registro = self.dados[rrn]
            if registro is not None:
                resultados.append(registro)
            self._in_ordem(no_atual['direita'], resultados)

    # --- Métodos CRUD Públicos (Comum a Todos) ---
    def incluir_registro(self, registro):
        """Adiciona o registro ao vetor de dados e o indexa na ABB."""
        chave = self._get_chave_do_registro(registro)
        novo_rrn = len(self.dados)
        self.dados.append(registro)
        self.raiz = self._inserir_no_arvore(self.raiz, chave, novo_rrn)
        self.salvar_dados()
        return novo_rrn

    def buscar_por_chave(self, chave):
        """Busca o registro na ABB e recupera o objeto completo pelo RRN."""
        no_encontrado = self._buscar_no_arvore(chave)
        if no_encontrado:
            registro = self.dados[no_encontrado['rrn']]
            if registro is not None:
                return registro
        return None

    def excluir_registro(self, chave):
        """Marca o registro como None no vetor de dados e o remove da ABB."""
        no_encontrado = self._buscar_no_arvore(chave)
        if no_encontrado is None:
            return False
        rrn = no_encontrado['rrn']
        self.dados[rrn] = None  # Exclusão Lógica
        self.raiz = self._remover_no_arvore(self.raiz, chave)  # Exclusão Física do Índice
        self.salvar_dados()
        return True

    def listar_todos_ordenado(self):
        """Retorna todos os registros em ordem crescente da chave."""
        resultados = []
        self._in_ordem(self.raiz, resultados)
        return resultados
