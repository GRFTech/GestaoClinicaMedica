from app.repository.EspecialidadeRepository import EspecialidadeRepository
from app.models.Especialidade import Especialidade


class EspecialidadeService:
    """Gerencia as regras de negócio para a entidade Especialidade."""

    def __init__(self):
        self.repo = EspecialidadeRepository()

    def incluir(self, codigo_especialidade, descricao, valor_consulta, limite_diario):

        # 1. VALIDAÇÃO: Chave duplicada
        if self.repo.buscar_por_chave(codigo_especialidade):
            return {"status": "ERRO", "mensagem": f"Código {codigo_especialidade} já está cadastrado."}

        # 2. VALIDAÇÃO: Campos obrigatórios
        if not all([descricao, valor_consulta, limite_diario]):
            return {"status": "ERRO", "mensagem": "Todos os campos são obrigatórios."}

        # 3. VALIDAÇÃO: Valores numéricos
        if valor_consulta <= 0 or limite_diario <= 0:
            return {"status": "ERRO", "mensagem": "Valor da Consulta e Limite Diário devem ser valores positivos."}

        # 4. CRIAÇÃO e INCLUSÃO
        nova_especialidade = Especialidade(codigo_especialidade, descricao, valor_consulta, limite_diario)
        self.repo.incluir_registro(nova_especialidade)

        return {"status": "SUCESSO", "mensagem": f"Especialidade '{descricao}' (Cód: {codigo_especialidade}) incluída."}

    def consultar(self, codigo_especialidade):
        # BUSCA
        especialidade = self.repo.buscar_por_chave(codigo_especialidade)
        if especialidade:
            return {"status": "SUCESSO", "dados": especialidade}
        return {"status": "ERRO", "mensagem": f"Especialidade {codigo_especialidade} não encontrada."}

    def alterar(self, codigo_especialidade, descricao=None, valor_consulta=None, limite_diario=None):

        especialidade = self.repo.buscar_por_chave(codigo_especialidade)
        if especialidade is None:
            return {"status": "ERRO",
                    "mensagem": f"Especialidade {codigo_especialidade} não encontrada para alteração."}

        # Aplicar modificações
        especialidade.descricao = descricao if descricao is not None else especialidade.descricao

        if valor_consulta is not None:
            try:
                valor_consulta = float(valor_consulta)
                if valor_consulta <= 0:
                    return {"status": "ERRO", "mensagem": "Valor da Consulta deve ser positivo."}
                especialidade.valor_consulta = valor_consulta
            except ValueError:
                pass  # Ignora se for inválido, mantém o valor antigo

        if limite_diario is not None:
            try:
                limite_diario = int(limite_diario)
                if limite_diario <= 0:
                    return {"status": "ERRO", "mensagem": "Limite Diário deve ser positivo."}
                especialidade.limite_diario = limite_diario
            except ValueError:
                pass  # Ignora se for inválido, mantém o valor antigo

        # Persistir a alteração em disco
        self.repo.salvar_dados()

        return {"status": "SUCESSO", "mensagem": f"Especialidade {codigo_especialidade} alterada com sucesso."}

    def excluir(self, codigo_especialidade):
        # EXCLUSÃO
        if self.repo.excluir_registro(codigo_especialidade):
            return {"status": "SUCESSO", "mensagem": f"Especialidade {codigo_especialidade} excluída."}
        return {"status": "ERRO", "mensagem": f"Especialidade {codigo_especialidade} não encontrada."}

    def listar_ordenado(self):
        # LISTAGEM ORDENADA
        return self.repo.listar_todos_ordenado()
