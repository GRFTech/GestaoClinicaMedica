from app.repository.CidadeRepository import CidadeRepository
# É necessário importar a classe Cidade para que o método 'incluir'
# possa instanciar um novo objeto.
from app.models.Cidade import Cidade


class CidadeService:
    def __init__(self):
        # CORREÇÃO: Chamada sem argumentos, pois o CidadeRepository
        # configura o nome do arquivo e a chave internamente.
        self.repo = CidadeRepository()

    def incluir(self, codigo, descricao, estado):
        # 1. VALIDAÇÃO: Chave duplicada
        if self.repo.buscar_por_chave(codigo):
            return {"status": "ERRO", "mensagem": f"Código {codigo} já está cadastrado."}

        # 2. VALIDAÇÃO: Campos obrigatórios
        if not descricao or not estado:
            return {"status": "ERRO", "mensagem": "Descrição e Estado são obrigatórios."}

        # 3. CRIAÇÃO e INCLUSÃO
        nova_cidade = Cidade(codigo, descricao, estado)
        self.repo.incluir_registro(nova_cidade)
        return {"status": "SUCESSO", "mensagem": f"Cidade {descricao} (Cód: {codigo}) incluída."}

    def consultar(self, codigo):
        # BUSCA
        cidade = self.repo.buscar_por_chave(codigo)
        if cidade:
            return {"status": "SUCESSO", "dados": cidade.to_dict()}  # <-- converte para dict
        return {"status": "ERRO", "mensagem": f"Cidade {codigo} não encontrada."}

    def alterar(self, codigo, nova_descricao, novo_estado):
        # ALTERAÇÃO (Requer buscar, modificar e incluir, o que sobrescreve)
        cidade = self.repo.buscar_por_chave(codigo)
        if cidade is None:
            return {"status": "ERRO", "mensagem": f"Cidade {codigo} não encontrada para alteração."}

        # Aplicar modificações (mantendo o código/chave)
        cidade.descricao = nova_descricao if nova_descricao else cidade.descricao
        cidade.estado = novo_estado if novo_estado else cidade.estado

        # O Repositório cuida da atualização do registro em memória
        self.repo.salvar_dados()  # Salvamos o vetor completo de volta ao arquivo

        return {"status": "SUCESSO", "mensagem": f"Cidade {codigo} alterada com sucesso."}

    def excluir(self, codigo):
        # EXCLUSÃO
        if self.repo.excluir_registro(codigo):
            return {"status": "SUCESSO", "mensagem": f"Cidade {codigo} excluída."}
        return {"status": "ERRO", "mensagem": f"Cidade {codigo} não encontrada."}

    def listar_ordenado(self):
        # LISTAGEM ORDENADA
        # O Repositório já retorna a lista ordenada pela ABB
        return self.repo.listar_todos_ordenado()
