from app.repository.ExameRepository import ExameRepository
from app.models.Exame import Exame
# Necessário para verificar a chave estrangeira
from app.services.EspecialidadeService import EspecialidadeService


class ExameService:
    """Gerencia as regras de negócio para a entidade Exame."""

    def __init__(self):
        self.repo = ExameRepository()
        # Inicializa serviço para validação de chave estrangeira (FK)
        self.especialidade_service = EspecialidadeService()

    def incluir(self, codigo_exame, descricao, codigo_especialidade, valor_exame):

        # 1. VALIDAÇÃO: Chave duplicada
        if self.repo.buscar_por_chave(codigo_exame):
            return {"status": "ERRO", "mensagem": f"Código do Exame {codigo_exame} já está cadastrado."}

        # 2. VALIDAÇÃO: Chave Estrangeira (Especialidade)
        if not self.especialidade_service.consultar(codigo_especialidade).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Especialidade com código {codigo_especialidade} não encontrada. O exame deve pertencer a uma especialidade válida."}

        # 3. VALIDAÇÃO: Campos obrigatórios (simplificado)
        if not all([descricao]):
            return {"status": "ERRO", "mensagem": "A Descrição do exame é obrigatória."}

        # 4. VALIDAÇÃO: Valor numérico
        if valor_exame <= 0:
            return {"status": "ERRO", "mensagem": "O Valor do Exame deve ser um valor positivo."}

        # 5. CRIAÇÃO e INCLUSÃO
        novo_exame = Exame(codigo_exame, descricao, codigo_especialidade, valor_exame)
        self.repo.incluir_registro(novo_exame)

        return {"status": "SUCESSO", "mensagem": f"Exame '{descricao}' (Cód: {codigo_exame}) incluído."}

    def consultar(self, codigo_exame):
        # BUSCA
        exame = self.repo.buscar_por_chave(codigo_exame)
        if exame:
            return {"status": "SUCESSO", "dados": exame}
        return {"status": "ERRO", "mensagem": f"Exame {codigo_exame} não encontrado."}

    def alterar(self, codigo_exame, descricao=None, codigo_especialidade=None, valor_exame=None):

        exame = self.repo.buscar_por_chave(codigo_exame)
        if exame is None:
            return {"status": "ERRO", "mensagem": f"Exame {codigo_exame} não encontrado para alteração."}

        # Validação da Chave Estrangeira (Especialidade)
        if codigo_especialidade is not None and not self.especialidade_service.consultar(codigo_especialidade).get(
                "dados"):
            return {"status": "ERRO",
                    "mensagem": f"Especialidade com código {codigo_especialidade} não encontrada. Alteração cancelada."}

        # Aplicar modificações
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
                pass  # Ignora se for inválido, mantém o valor antigo

        # Persistir a alteração em disco
        self.repo.salvar_dados()

        return {"status": "SUCESSO", "mensagem": f"Exame {codigo_exame} alterado com sucesso."}

    def excluir(self, codigo_exame):
        # EXCLUSÃO
        if self.repo.excluir_registro(codigo_exame):
            return {"status": "SUCESSO", "mensagem": f"Exame {codigo_exame} excluído."}
        return {"status": "ERRO", "mensagem": f"Exame {codigo_exame} não encontrado."}

    def listar_ordenado(self):
        # LISTAGEM ORDENADA
        return self.repo.listar_todos_ordenado()

    def gerar_proximo_codigo(self):
        """Retorna o próximo código de exame disponível."""
        exames = self.repo.listar_todos_ordenado()
        if not exames:
            return 1
        ultimo_codigo = max(exame.codigo_exame for exame in exames)
        return ultimo_codigo + 1
