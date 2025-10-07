from app.repository.ExameRepository import ExameRepository
from app.models.Exame import Exame
from app.services.EspecialidadeService import EspecialidadeService


class ExameService:
    """Gerencia as regras de negócio para a entidade Exame."""

    def __init__(self):
        self.repo = ExameRepository()
        self.especialidade_service = EspecialidadeService()

    def incluir(self, codigo_exame, descricao, codigo_especialidade, valor_exame):


        if self.repo.buscar_por_chave(codigo_exame):
            return {"status": "ERRO", "mensagem": f"Código do Exame {codigo_exame} já está cadastrado."}


        if not self.especialidade_service.consultar(codigo_especialidade).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Especialidade com código {codigo_especialidade} não encontrada. O exame deve pertencer a uma especialidade válida."}


        if not all([descricao]):
            return {"status": "ERRO", "mensagem": "A Descrição do exame é obrigatória."}


        if valor_exame <= 0:
            return {"status": "ERRO", "mensagem": "O Valor do Exame deve ser um valor positivo."}


        novo_exame = Exame(codigo_exame, descricao, codigo_especialidade, valor_exame)
        self.repo.incluir_registro(novo_exame)

        return {"status": "SUCESSO", "mensagem": f"Exame '{descricao}' (Cód: {codigo_exame}) incluído."}

    def consultar(self, codigo_exame):

        exame = self.repo.buscar_por_chave(codigo_exame)
        if exame:
            return {"status": "SUCESSO", "dados": exame}
        return {"status": "ERRO", "mensagem": f"Exame {codigo_exame} não encontrado."}

    def alterar(self, codigo_exame, descricao=None, codigo_especialidade=None, valor_exame=None):

        exame = self.repo.buscar_por_chave(codigo_exame)
        if exame is None:
            return {"status": "ERRO", "mensagem": f"Exame {codigo_exame} não encontrado para alteração."}


        if codigo_especialidade is not None and not self.especialidade_service.consultar(codigo_especialidade).get(
                "dados"):
            return {"status": "ERRO",
                    "mensagem": f"Especialidade com código {codigo_especialidade} não encontrada. Alteração cancelada."}


        exame.descricao = descricao if descricao is not None else exame.descricao

        if codigo_especialidade is not None:
            exame.codigo_especialidade = codigo_especialidade

        if valor_exame is not None:
            try:
                valor_exame = float(valor_exame)
                if valor_exame <= 0:
                    return {"status": "ERRO", "mensagem": "Valor do Exame deve ser positivo. Alteração cancelada."}
                exame.valor_exame = valor_exame
            except ValueError:
                pass


        self.repo.salvar_dados()

        return {"status": "SUCESSO", "mensagem": f"Exame {codigo_exame} alterado com sucesso."}

    def excluir(self, codigo_exame):

        if self.repo.excluir_registro(codigo_exame):
            return {"status": "SUCESSO", "mensagem": f"Exame {codigo_exame} excluído."}
        return {"status": "ERRO", "mensagem": f"Exame {codigo_exame} não encontrado."}

    def listar_ordenado(self):

        return self.repo.listar_todos_ordenado()

    def gerar_proximo_codigo(self):
        """Retorna o próximo código de exame disponível."""
        exames = self.repo.listar_todos_ordenado()
        if not exames:
            return 1
        ultimo_codigo = max(exame.codigo_exame for exame in exames)
        return ultimo_codigo + 1
