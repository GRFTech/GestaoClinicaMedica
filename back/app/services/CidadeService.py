from app.repository.CidadeRepository import CidadeRepository
from app.models.Cidade import Cidade


class CidadeService:
    def __init__(self):
        self.repo = CidadeRepository()

    def incluir(self, codigo, descricao, estado):
        if self.repo.buscar_por_chave(codigo):
            return {"status": "ERRO", "mensagem": f"Código {codigo} já está cadastrado."}

        if not descricao or not estado:
            return {"status": "ERRO", "mensagem": "Descrição e Estado são obrigatórios."}

        nova_cidade = Cidade(codigo, descricao, estado)
        self.repo.incluir_registro(nova_cidade)
        return {"status": "SUCESSO", "mensagem": f"Cidade {descricao} (Cód: {codigo}) incluída."}

    def consultar(self, codigo):
        cidade = self.repo.buscar_por_chave(codigo)
        if cidade:
            return {"status": "SUCESSO", "dados": cidade.to_dict()}
        return {"status": "ERRO", "mensagem": f"Cidade {codigo} não encontrada."}

    def alterar(self, codigo, nova_descricao, novo_estado):

        cidade = self.repo.buscar_por_chave(codigo)
        if cidade is None:
            return {"status": "ERRO", "mensagem": f"Cidade {codigo} não encontrada para alteração."}


        cidade.descricao = nova_descricao if nova_descricao else cidade.descricao
        cidade.estado = novo_estado if novo_estado else cidade.estado


        self.repo.salvar_dados()

        return {"status": "SUCESSO", "mensagem": f"Cidade {codigo} alterada com sucesso."}

    def excluir(self, codigo):

        if self.repo.excluir_registro(codigo):
            return {"status": "SUCESSO", "mensagem": f"Cidade {codigo} excluída."}
        return {"status": "ERRO", "mensagem": f"Cidade {codigo} não encontrada."}

    def listar_ordenado(self):

        return self.repo.listar_todos_ordenado()

    def obter_ultimo_codigo(self):
        """Retorna o maior código de cidade cadastrado, ou 0 se não houver cidades."""
        cidades = self.repo.listar_todos_ordenado()
        if not cidades:
            return 0

        ultimo = max(cidades, key=lambda c: c.codigo)
        return ultimo.codigo
