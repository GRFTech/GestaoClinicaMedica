import pickle
import os


class BaseRepository:
    def __init__(self, nome_base, chave_primaria_atributo):

        self.chave_primaria_atributo = chave_primaria_atributo

        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.data_dir = os.path.join(base_dir, "data")
        os.makedirs(self.data_dir, exist_ok=True)
        self.nome_arquivo = os.path.join(self.data_dir, f"{nome_base}.dat")


        self.dados = []
        self.raiz = None

        # 3. Carregamento inicial
        self.carregar_dados()
        self.reconstruir_indice()


    def carregar_dados(self):

        if os.path.exists(self.nome_arquivo):
            try:
                with open(self.nome_arquivo, 'rb') as f:
                    self.dados = pickle.load(f)
            except Exception as e:
                print(f"[ERRO] Falha ao carregar {self.nome_arquivo}: {e}")
                self.dados = []
        else:
            print(f"[INFO] {self.nome_arquivo} não encontrado, iniciando base vazia.")

    def salvar_dados(self):

        with open(self.nome_arquivo, 'wb') as f:
            pickle.dump(self.dados, f)


    def _get_chave_do_registro(self, registro):
        return getattr(registro, self.chave_primaria_atributo)

    def _inserir_no_arvore(self, no_atual, chave, rrn):
        if no_atual is None:
            return {'chave': chave, 'rrn': rrn, 'esquerda': None, 'direita': None}
        if chave < no_atual['chave']:
            no_atual['esquerda'] = self._inserir_no_arvore(no_atual['esquerda'], chave, rrn)
        elif chave > no_atual['chave']:
            no_atual['direita'] = self._inserir_no_arvore(no_atual['direita'], chave, rrn)
        return no_atual

    def reconstruir_indice(self):
        self.raiz = None
        for rrn, registro in enumerate(self.dados):
            if registro is not None:
                chave = self._get_chave_do_registro(registro)
                self.raiz = self._inserir_no_arvore(self.raiz, chave, rrn)

    def _buscar_no_arvore(self, chave):
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
        atual = no_atual
        while atual['esquerda'] is not None:
            atual = atual['esquerda']
        return atual

    def _remover_no_arvore(self, no_atual, chave):
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

        if no_atual is not None:
            self._in_ordem(no_atual['esquerda'], resultados)
            rrn = no_atual['rrn']
            registro = self.dados[rrn]
            if registro is not None:
                resultados.append(registro)
            self._in_ordem(no_atual['direita'], resultados)


    def incluir_registro(self, registro):
        chave = self._get_chave_do_registro(registro)
        novo_rrn = len(self.dados)
        self.dados.append(registro)
        self.raiz = self._inserir_no_arvore(self.raiz, chave, novo_rrn)
        self.salvar_dados()
        return novo_rrn

    def buscar_por_chave(self, chave):
        no_encontrado = self._buscar_no_arvore(chave)
        if no_encontrado:
            registro = self.dados[no_encontrado['rrn']]
            if registro is not None:
                return registro
        return None

    def excluir_registro(self, chave):

        no_encontrado = self._buscar_no_arvore(chave)
        if no_encontrado is None:
            return False
        rrn = no_encontrado['rrn']
        self.dados[rrn] = None
        self.raiz = self._remover_no_arvore(self.raiz, chave)
        self.salvar_dados()
        return True

    def listar_todos_ordenado(self):
        """Retorna todos os registros em ordem crescente da chave."""
        resultados = []
        self._in_ordem(self.raiz, resultados)

        self.carregar_dados()
        self.reconstruir_indice()
        return resultados
