import re
from app.repository.ConsultaRepository import ConsultaRepository
from app.models.Consulta import Consulta

from app.services.PacienteService import PacienteService
from app.services.MedicoService import MedicoService
from app.services.ExameService import ExameService
from app.services.DiariaService import DiariaService

class ConsultaService:

    def __init__(self):
        self.repo = ConsultaRepository()
        self.paciente_service = PacienteService()
        self.medico_service = MedicoService()
        self.exame_service = ExameService()
        self.diaria_service = DiariaService()

    def _validar_data_hora(self, data, hora):
        if not re.match(r"^\d{2}/\d{2}/\d{4}$", data):
            return {"status": "ERRO", "mensagem": "Formato de Data inválido. Use DD/MM/AAAA."}
        if not re.match(r"^\d{2}:\d{2}$", hora):
            return {"status": "ERRO", "mensagem": "Formato de Hora inválido. Use HH:MM."}
        return {"status": "SUCESSO", "mensagem": "Data e Hora válidas."}

    def incluir(self, codigo_consulta, codigo_paciente, codigo_medico, codigo_exame, data, hora):

        if self.repo.buscar_por_chave(codigo_consulta):
            return {"status": "ERRO", "mensagem": f"Código da Consulta {codigo_consulta} já está cadastrado."}

        paciente_info = self.paciente_service.consultar(codigo_paciente)
        if paciente_info["status"] == "ERRO":
            return {"status": "ERRO", "mensagem": f"Paciente com código {codigo_paciente} não encontrado."}

        medico_info = self.medico_service.consultar(codigo_medico)
        if medico_info["status"] == "ERRO":
            return {"status": "ERRO", "mensagem": f"Médico com código {codigo_medico} não encontrado."}

        if self.exame_service.consultar(codigo_exame)["status"] == "ERRO":
            return {"status": "ERRO", "mensagem": f"Exame com código {codigo_exame} não encontrado."}

        validacao_tempo = self._validar_data_hora(data, hora)
        if validacao_tempo["status"] == "ERRO":
            return validacao_tempo

        cod_especialidade = medico_info["dados"]["codigo_especialidade"]

        resultado_limite = self.diaria_service.verificar_limite(data, cod_especialidade)
        if resultado_limite["status"] == "ERRO":
            return resultado_limite

        nova_consulta = Consulta(codigo_consulta, codigo_paciente, codigo_medico, codigo_exame, data, hora)
        self.repo.incluir_registro(nova_consulta)

        self.diaria_service.incrementar_contagem(data, cod_especialidade)

        return {"status": "SUCESSO",
                "mensagem": f"Consulta (Cód: {codigo_consulta}) agendada. Limite diário atualizado."}

    def consultar(self, codigo_consulta):
        consulta = self.repo.buscar_por_chave(codigo_consulta)
        if consulta:
            return {"status": "SUCESSO", "dados": consulta}
        return {"status": "ERRO", "mensagem": f"Consulta {codigo_consulta} não encontrada."}

    def alterar(self, codigo_consulta, codigo_paciente=None, codigo_medico=None, codigo_exame=None, data=None,
                hora=None):

        consulta = self.repo.buscar_por_chave(codigo_consulta)
        if consulta is None:
            return {"status": "ERRO", "mensagem": f"Consulta {codigo_consulta} não encontrada para alteração."}

        if codigo_paciente is not None and self.paciente_service.consultar(codigo_paciente)["status"] == "ERRO":
            return {"status": "ERRO",
                    "mensagem": f"Paciente com código {codigo_paciente} não encontrado. Alteração cancelada."}

        if codigo_medico is not None and self.medico_service.consultar(codigo_medico)["status"] == "ERRO":
            return {"status": "ERRO",
                    "mensagem": f"Médico com código {codigo_medico} não encontrado. Alteração cancelada."}

        if codigo_exame is not None and self.exame_service.consultar(codigo_exame)["status"] == "ERRO":
            return {"status": "ERRO",
                    "mensagem": f"Exame com código {codigo_exame} não encontrado. Alteração cancelada."}

        if data or hora:
            data_final = data if data is not None else consulta.data
            hora_final = hora if hora is not None else consulta.hora
            validacao_tempo = self._validar_data_hora(data_final, hora_final)
            if validacao_tempo["status"] == "ERRO":
                return validacao_tempo

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

        self.repo.salvar_dados()

        return {"status": "SUCESSO", "mensagem": f"Consulta {codigo_consulta} alterada com sucesso."}

    def excluir(self, codigo_consulta):
        consulta_info = self.consultar(codigo_consulta)
        if consulta_info["status"] == "ERRO":
            return consulta_info
        consulta = consulta_info["dados"]

        medico_info = self.medico_service.consultar(consulta.codigo_medico)
        cod_especialidade = medico_info["dados"]["codigo_especialidade"]

        if self.repo.excluir_registro(codigo_consulta):
            self.diaria_service.decrementar_contagem(consulta.data, cod_especialidade)
            return {"status": "SUCESSO",
                    "mensagem": f"Consulta {codigo_consulta} excluída e contagem diária decrementada."}

        return {"status": "ERRO", "mensagem": f"Consulta {codigo_consulta} não encontrada."}

    def listar_ordenado(self):
        return self.repo.listar_todos_ordenado()

    def gerar_proximo_codigo(self) -> int:

        consultas = self.listar_ordenado()
        if not consultas:
            return 1
        ultimo_codigo = consultas[-1].codigo_consulta
        return ultimo_codigo + 1
