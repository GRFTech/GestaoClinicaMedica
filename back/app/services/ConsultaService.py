import re
from app.repository.ConsultaRepository import ConsultaRepository
from app.models.Consulta import Consulta

from app.services.PacienteService import PacienteService
from app.services.MedicoService import MedicoService
from app.services.ExameService import ExameService
from app.services.DiariaService import DiariaService  # NOVO: Importa DiariaService


class ConsultaService:

    def __init__(self):
        self.repo = ConsultaRepository()
        self.paciente_service = PacienteService()
        self.medico_service = MedicoService()
        self.exame_service = ExameService()
        self.diaria_service = DiariaService()  # NOVO: Inicializa o DiariaService

    def _validar_data_hora(self, data, hora):
        if not re.match(r"^\d{2}/\d{2}/\d{4}$", data):
            return {"status": "ERRO", "mensagem": "Formato de Data inválido. Use DD/MM/AAAA."}
        if not re.match(r"^\d{2}:\d{2}$", hora):
            return {"status": "ERRO", "mensagem": "Formato de Hora inválido. Use HH:MM."}
        return {"status": "SUCESSO", "mensagem": "Data e Hora válidas."}

    def incluir(self, codigo_consulta, codigo_paciente, codigo_medico, codigo_exame, data, hora):

        # 1. VALIDAÇÃO: Chave duplicada
        if self.repo.buscar_por_chave(codigo_consulta):
            return {"status": "ERRO", "mensagem": f"Código da Consulta {codigo_consulta} já está cadastrado."}

        # 2. VALIDAÇÃO: Chaves Estrangeiras (FKs)
        paciente_info = self.paciente_service.consultar(codigo_paciente)
        if paciente_info["status"] == "ERRO":
            return {"status": "ERRO", "mensagem": f"Paciente com código {codigo_paciente} não encontrado."}

        medico_info = self.medico_service.consultar(codigo_medico)
        if medico_info["status"] == "ERRO":
            return {"status": "ERRO", "mensagem": f"Médico com código {codigo_medico} não encontrado."}

        if self.exame_service.consultar(codigo_exame)["status"] == "ERRO":
            return {"status": "ERRO", "mensagem": f"Exame com código {codigo_exame} não encontrado."}

        # 3. VALIDAÇÃO: Formato de Data e Hora
        validacao_tempo = self._validar_data_hora(data, hora)
        if validacao_tempo["status"] == "ERRO":
            return validacao_tempo

        # 4. REGRA DE NEGÓCIO: Obter Especialidade e Verificar Limite (5.1)
        cod_especialidade = medico_info["dados"]["codigo_especialidade"]

        resultado_limite = self.diaria_service.verificar_limite(data, cod_especialidade)
        if resultado_limite["status"] == "ERRO":
            return resultado_limite  # Retorna erro de limite excedido

        # 5. CRIAÇÃO e INCLUSÃO
        nova_consulta = Consulta(codigo_consulta, codigo_paciente, codigo_medico, codigo_exame, data, hora)
        self.repo.incluir_registro(nova_consulta)

        # 6. REGRA DE NEGÓCIO: Incrementar Diária (5.3)
        self.diaria_service.incrementar_contagem(data, cod_especialidade)

        return {"status": "SUCESSO",
                "mensagem": f"Consulta (Cód: {codigo_consulta}) agendada. Limite diário atualizado."}

    def consultar(self, codigo_consulta):
        # BUSCA
        consulta = self.repo.buscar_por_chave(codigo_consulta)
        if consulta:
            return {"status": "SUCESSO", "dados": consulta}  # Retorna o objeto Consulta
        return {"status": "ERRO", "mensagem": f"Consulta {codigo_consulta} não encontrada."}

    def alterar(self, codigo_consulta, codigo_paciente=None, codigo_medico=None, codigo_exame=None, data=None,
                hora=None):

        consulta = self.repo.buscar_por_chave(codigo_consulta)
        if consulta is None:
            return {"status": "ERRO", "mensagem": f"Consulta {codigo_consulta} não encontrada para alteração."}

        # [NOTA]: A lógica de alteração de limite diário é mais complexa (requer verificar limite na nova data/especialidade e decrementar na antiga).
        # Para simplificar, focaremos apenas no limite da inclusão/exclusão, conforme solicitado.

        # ... (Validação de FKs e Data/Hora, conforme o seu código original) ...
        # [Se houver alteração de médico ou data, a lógica de limite precisa ser refeita aqui]

        # Validação das Chaves Estrangeiras (FKs)
        if codigo_paciente is not None and self.paciente_service.consultar(codigo_paciente)["status"] == "ERRO":
            return {"status": "ERRO",
                    "mensagem": f"Paciente com código {codigo_paciente} não encontrado. Alteração cancelada."}

        if codigo_medico is not None and self.medico_service.consultar(codigo_medico)["status"] == "ERRO":
            return {"status": "ERRO",
                    "mensagem": f"Médico com código {codigo_medico} não encontrado. Alteração cancelada."}

        if codigo_exame is not None and self.exame_service.consultar(codigo_exame)["status"] == "ERRO":
            return {"status": "ERRO",
                    "mensagem": f"Exame com código {codigo_exame} não encontrado. Alteração cancelada."}

        # Validação de Data e Hora se fornecidas
        if data or hora:
            data_final = data if data is not None else consulta.data
            hora_final = hora if hora is not None else consulta.hora
            validacao_tempo = self._validar_data_hora(data_final, hora_final)
            if validacao_tempo["status"] == "ERRO":
                return validacao_tempo

        # Aplicar modificações (mantendo a lógica de limite simples em Alteração)
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
        # 1. Obter consulta antes de excluir (para pegar data e médico)
        consulta_info = self.consultar(codigo_consulta)
        if consulta_info["status"] == "ERRO":
            return consulta_info
        consulta = consulta_info["dados"]  # Raw Consulta object

        # 2. Obter Especialidade para Decremento (5.4)
        medico_info = self.medico_service.consultar(consulta.codigo_medico)
        cod_especialidade = medico_info["dados"]["codigo_especialidade"]  # Assuming medico_service returns dict

        # 3. Exclusão Lógica no Repositório
        if self.repo.excluir_registro(codigo_consulta):
            # 4. REGRA DE NEGÓCIO: Decrementar Diária (5.4)
            self.diaria_service.decrementar_contagem(consulta.data, cod_especialidade)
            return {"status": "SUCESSO",
                    "mensagem": f"Consulta {codigo_consulta} excluída e contagem diária decrementada."}

        return {"status": "ERRO", "mensagem": f"Consulta {codigo_consulta} não encontrada."}

    def listar_ordenado(self):
        # LISTAGEM ORDENADA
        return self.repo.listar_todos_ordenado()

    def gerar_proximo_codigo(self) -> int:

        consultas = self.listar_ordenado()
        if not consultas:
            return 1
        # Pega o último código da lista ordenada e soma 1
        ultimo_codigo = consultas[-1].codigo_consulta
        return ultimo_codigo + 1
