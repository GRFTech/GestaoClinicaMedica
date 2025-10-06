import re
from app.repository.ConsultaRepository import ConsultaRepository
from app.models.Consulta import Consulta
# Importa serviços para validação das Chaves Estrangeiras (FKs)
from app.services.PacienteService import PacienteService
from app.services.MedicoService import MedicoService
from app.services.ExameService import ExameService


class ConsultaService:
    """Gerencia as regras de negócio para a entidade Consulta."""

    def __init__(self):
        self.repo = ConsultaRepository()
        # Inicializa serviços para validação de chaves estrangeiras (FKs)
        self.paciente_service = PacienteService()
        self.medico_service = MedicoService()
        self.exame_service = ExameService()

    def _validar_data_hora(self, data, hora):
        """Valida o formato da data (DD/MM/AAAA) e hora (HH:MM)."""
        # Regex simplificada para formato DD/MM/AAAA e HH:MM
        if not re.match(r"^\d{2}/\d{2}/\d{4}$", data):
            return {"status": "ERRO", "mensagem": "Formato de Data inválido. Use DD/MM/AAAA."}
        if not re.match(r"^\d{2}:\d{2}$", hora):
            return {"status": "ERRO", "mensagem": "Formato de Hora inválido. Use HH:MM."}

        # Aqui, em um sistema real, faríamos validações de data (se é futura, se é um dia útil, etc.)
        return {"status": "SUCESSO", "mensagem": "Data e Hora válidas."}

    def incluir(self, codigo_consulta, codigo_paciente, codigo_medico, codigo_exame, data, hora):

        # 1. VALIDAÇÃO: Chave duplicada
        if self.repo.buscar_por_chave(codigo_consulta):
            return {"status": "ERRO", "mensagem": f"Código da Consulta {codigo_consulta} já está cadastrado."}

        # 2. VALIDAÇÃO: Chaves Estrangeiras (FKs)
        if not self.paciente_service.consultar(codigo_paciente).get("dados"):
            return {"status": "ERRO", "mensagem": f"Paciente com código {codigo_paciente} não encontrado."}

        if not self.medico_service.consultar(codigo_medico).get("dados"):
            return {"status": "ERRO", "mensagem": f"Médico com código {codigo_medico} não encontrado."}

        if not self.exame_service.consultar(codigo_exame).get("dados"):
            return {"status": "ERRO", "mensagem": f"Exame com código {codigo_exame} não encontrado."}

        # 3. VALIDAÇÃO: Formato de Data e Hora
        validacao_tempo = self._validar_data_hora(data, hora)
        if validacao_tempo["status"] == "ERRO":
            return validacao_tempo

        # 4. CRIAÇÃO e INCLUSÃO
        nova_consulta = Consulta(codigo_consulta, codigo_paciente, codigo_medico, codigo_exame, data, hora)
        self.repo.incluir_registro(nova_consulta)

        return {"status": "SUCESSO", "mensagem": f"Consulta (Cód: {codigo_consulta}) agendada para {data} às {hora}."}

    def consultar(self, codigo_consulta):
        # BUSCA
        consulta = self.repo.buscar_por_chave(codigo_consulta)
        if consulta:
            return {"status": "SUCESSO", "dados": consulta}
        return {"status": "ERRO", "mensagem": f"Consulta {codigo_consulta} não encontrada."}

    def alterar(self, codigo_consulta, codigo_paciente=None, codigo_medico=None, codigo_exame=None, data=None,
                hora=None):

        consulta = self.repo.buscar_por_chave(codigo_consulta)
        if consulta is None:
            return {"status": "ERRO", "mensagem": f"Consulta {codigo_consulta} não encontrada para alteração."}

        # Validação das Chaves Estrangeiras (FKs)
        if codigo_paciente is not None and not self.paciente_service.consultar(codigo_paciente).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Paciente com código {codigo_paciente} não encontrado. Alteração cancelada."}

        if codigo_medico is not None and not self.medico_service.consultar(codigo_medico).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Médico com código {codigo_medico} não encontrado. Alteração cancelada."}

        if codigo_exame is not None and not self.exame_service.consultar(codigo_exame).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Exame com código {codigo_exame} não encontrado. Alteração cancelada."}

        # Validação de Data e Hora se fornecidas
        if data or hora:
            data_final = data if data is not None else consulta.data
            hora_final = hora if hora is not None else consulta.hora
            validacao_tempo = self._validar_data_hora(data_final, hora_final)
            if validacao_tempo["status"] == "ERRO":
                return validacao_tempo

        # Aplicar modificações
        if codigo_paciente is not None:
            consulta.codigo_paciente = codigo_paciente
        if codigo_medico is not None:
            consulta.codigo_medico = codigo_medico
        if codigo_exame is not None:
            consulta.codigo_exame = codigo_exame
        if data is not None:
            consulta.data = data
        if hora is not None:
            consulta.hora = hora

        # Persistir a alteração em disco
        self.repo.salvar_dados()

        return {"status": "SUCESSO", "mensagem": f"Consulta {codigo_consulta} alterada com sucesso."}

    def excluir(self, codigo_consulta):
        # EXCLUSÃO
        if self.repo.excluir_registro(codigo_consulta):
            return {"status": "SUCESSO", "mensagem": f"Consulta {codigo_consulta} excluída."}
        return {"status": "ERRO", "mensagem": f"Consulta {codigo_consulta} não encontrada."}

    def listar_ordenado(self):
        # LISTAGEM ORDENADA
        return self.repo.listar_todos_ordenado()


