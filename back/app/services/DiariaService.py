import re
from app.repository.DiariaRepository import DiariaRepository
from app.models.Diaria import Diaria
from app.services.EspecialidadeService import EspecialidadeService


class DiariaService:
    """
    Gerencia as regras de negócio para a entidade Diária:
    - Controla a contagem de consultas por dia e especialidade.
    - Verifica limites diários definidos pela especialidade.
    """

    def __init__(self):
        self.repo = DiariaRepository()
        self.especialidade_service = EspecialidadeService()

    def _gerar_chave_composta(self, codigo_dia, codigo_especialidade):
        """Gera chave única para cada diária."""
        return f"{codigo_dia}-{codigo_especialidade}"

    def _converter_data_para_codigo(self, data_ddmmaaaa):
        """Converte 'DD/MM/AAAA' → inteiro 'AAAAMMDD'."""
        try:
            partes = data_ddmmaaaa.strip().split('/')
            if len(partes) != 3:
                raise ValueError("Formato de data inválido.")
            return int(f"{partes[2]}{partes[1]}{partes[0]}")
        except Exception:
            raise ValueError(f"Erro ao converter data '{data_ddmmaaaa}'.")

    # ------------------ CONSULTAS DE DIÁRIA ------------------

    def consultar(self, codigo_dia, codigo_especialidade):
        """Busca uma diária existente, ou cria uma nova com 0 consultas."""
        chave = self._gerar_chave_composta(codigo_dia, codigo_especialidade)
        diaria = self.repo.buscar_por_chave(chave)

        if not diaria:
            diaria = Diaria(codigo_dia, codigo_especialidade, 0)
            self.repo.incluir_registro(diaria)
            self.repo.salvar_dados()

        return {"status": "SUCESSO", "dados": diaria}

    def listar_ordenado(self):
        """Lista todas as diárias em ordem crescente de chave."""
        return self.repo.listar_todos_ordenado()

    # ------------------ REGRAS DE NEGÓCIO ------------------

    def verificar_limite(self, data_consulta_ddmmaaaa, codigo_especialidade):
        """
        Verifica se a especialidade atingiu o limite de consultas para o dia.
        Caso o registro de diária não exista, ele é criado automaticamente.
        """
        # Consulta especialidade
        resultado_esp = self.especialidade_service.consultar(codigo_especialidade)
        if resultado_esp["status"] == "ERRO":
            return {"status": "ERRO", "mensagem": f"Especialidade {codigo_especialidade} não encontrada."}

        especialidade = resultado_esp["dados"]
        limite_diario = especialidade.limite_diario
        descricao_esp = especialidade.descricao

        # Converte a data para código
        try:
            codigo_dia = self._converter_data_para_codigo(data_consulta_ddmmaaaa)
        except ValueError as e:
            return {"status": "ERRO", "mensagem": str(e)}

        diaria = self.consultar(codigo_dia, codigo_especialidade)["dados"]

        # Evita erro de contagem negativa ou corrompida
        if diaria.quantidade_consultas < 0:
            diaria.quantidade_consultas = 0
            self.repo.salvar_dados()

        # Valida limite
        if diaria.quantidade_consultas >= limite_diario:
            return {
                "status": "ERRO",
                "mensagem": (
                    f"LIMITE EXCEDIDO: A especialidade '{descricao_esp}' "
                    f"({codigo_especialidade}) já atingiu o limite de {limite_diario} "
                    f"consultas para o dia {data_consulta_ddmmaaaa}."
                ),
            }

        return {"status": "SUCESSO", "mensagem": "Limite OK."}

    def incrementar_contagem(self, data_consulta_ddmmaaaa, codigo_especialidade, incremento=1):
        """Incrementa o total de consultas para a diária informada."""
        try:
            codigo_dia = self._converter_data_para_codigo(data_consulta_ddmmaaaa)
        except ValueError as e:
            return {"status": "ERRO", "mensagem": str(e)}

        chave = self._gerar_chave_composta(codigo_dia, codigo_especialidade)
        diaria = self.repo.buscar_por_chave(chave)

        if not diaria:
            diaria = Diaria(codigo_dia, codigo_especialidade, incremento)
            self.repo.incluir_registro(diaria)
        else:
            diaria.quantidade_consultas += incremento
            if diaria.quantidade_consultas < 0:
                diaria.quantidade_consultas = 0

        self.repo.salvar_dados()
        return {
            "status": "SUCESSO",
            "mensagem": f"Contagem diária para {chave} agora é {diaria.quantidade_consultas}.",
        }

    def decrementar_contagem(self, data_consulta_ddmmaaaa, codigo_especialidade):
        """Decrementa a contagem de consultas do dia ao excluir uma consulta."""
        try:
            codigo_dia = self._converter_data_para_codigo(data_consulta_ddmmaaaa)
        except ValueError as e:
            return {"status": "ERRO", "mensagem": str(e)}

        chave = self._gerar_chave_composta(codigo_dia, codigo_especialidade)
        diaria = self.repo.buscar_por_chave(chave)

        if diaria:
            diaria.quantidade_consultas = max(0, diaria.quantidade_consultas - 1)
            self.repo.salvar_dados()
            return {
                "status": "SUCESSO",
                "mensagem": f"Contagem diária para {chave} agora é {diaria.quantidade_consultas}.",
            }

        return {"status": "AVISO", "mensagem": f"Diária {chave} não encontrada para decremento."}

    # ------------------ CRUD SIMPLES ------------------

    def incluir(self, codigo_dia, codigo_especialidade, quantidade_consultas):
        chave = self._gerar_chave_composta(codigo_dia, codigo_especialidade)
        if self.repo.buscar_por_chave(chave):
            return {"status": "ERRO", "mensagem": f"Diária {chave} já cadastrada."}

        nova_diaria = Diaria(codigo_dia, codigo_especialidade, quantidade_consultas)
        self.repo.incluir_registro(nova_diaria)
        self.repo.salvar_dados()
        return {"status": "SUCESSO", "mensagem": f"Diária {chave} criada com {quantidade_consultas} consultas."}

    def alterar(self, codigo_dia, codigo_especialidade, nova_quantidade):
        chave = self._gerar_chave_composta(codigo_dia, codigo_especialidade)
        diaria = self.repo.buscar_por_chave(chave)
        if not diaria:
            return {"status": "ERRO", "mensagem": f"Diária {chave} não encontrada."}

        diaria.quantidade_consultas = nova_quantidade
        self.repo.salvar_dados()
        return {"status": "SUCESSO", "mensagem": f"Diária {chave} alterada para {nova_quantidade} consultas."}

    def excluir(self, codigo_dia, codigo_especialidade):
        chave = self._gerar_chave_composta(codigo_dia, codigo_especialidade)
        if self.repo.excluir_registro(chave):
            self.repo.salvar_dados()
            return {"status": "SUCESSO", "mensagem": f"Diária {chave} excluída com sucesso."}
        return {"status": "ERRO", "mensagem": f"Diária {chave} não encontrada."}
