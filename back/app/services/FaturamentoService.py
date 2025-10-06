from _datetime import datetime


class FaturamentoService:
    def __init__(self, consulta_service, medico_service, especialidade_service, exame_service):
        self.consulta_service = consulta_service
        self.medico_service = medico_service
        self.especialidade_service = especialidade_service
        self.exame_service = exame_service

    def faturamento_por_dia(self, data):
        total = 0
        consultas = self.consulta_service.listar_ordenado()
        for c in consultas:
            if c.data == data:
                medico = self.medico_service.consultar(c.codigo_medico)["dados"]
                exame = self.exame_service.consultar(c.codigo_exame)["dados"].__dict__
                especialidade = self.especialidade_service.consultar(medico["codigo_especialidade"])[
                    "dados"].__dict__
                total += especialidade["valor_consulta"] + exame["valor_exame"]
        return total

    def faturamento_por_periodo(self, data_inicio, data_fim):
        """
        Calcula o faturamento total entre data_inicio e data_fim (inclusive).
        data_inicio e data_fim devem ser objetos datetime.date
        """
        total = 0
        consultas = self.consulta_service.listar_ordenado()

        for c in consultas:
            try:
                # Converte a data da consulta para date, assumindo formato DD/MM/YYYY
                data_consulta = datetime.strptime(c.data, "%d/%m/%Y").date()
            except (ValueError, TypeError):
                # Pula consultas com data inválida
                continue

            if data_inicio <= data_consulta <= data_fim:
                # Verifica se os serviços retornam dados antes de acessar atributos
                medico_result = self.medico_service.consultar(c.codigo_medico)
                if not medico_result.get("dados"):
                    continue
                medico = medico_result["dados"]

                exame_result = self.exame_service.consultar(c.codigo_exame)
                if not exame_result.get("dados"):
                    continue
                exame = exame_result["dados"].__dict__

                especialidade_result = self.especialidade_service.consultar(medico["codigo_especialidade"])
                if not especialidade_result.get("dados"):
                    continue
                especialidade = especialidade_result["dados"].__dict__

                # Soma o valor da consulta e do exame
                total += especialidade.get("valor_consulta", 0) + exame.get("valor_exame", 0)

        return total

    def faturamento_por_medico(self, codigo_medico):
        total = 0
        consultas = self.consulta_service.listar_ordenado()
        for c in consultas:
            if c.codigo_medico == codigo_medico:
                medico = self.medico_service.consultar(c.codigo_medico)["dados"]
                exame = self.exame_service.consultar(c.codigo_exame)["dados"].__dict__
                especialidade = self.especialidade_service.consultar(medico["codigo_especialidade"])[
                    "dados"].__dict__
                total += especialidade["valor_consulta"] + exame["valor_exame"]
        return total

    def faturamento_por_especialidade(self, codigo_especialidade):
        total = 0
        consultas = self.consulta_service.listar_ordenado()
        for c in consultas:
            medico = self.medico_service.consultar(c.codigo_medico)["dados"]
            if medico["codigo_especialidade"] == codigo_especialidade:
                exame = self.exame_service.consultar(c.codigo_exame)["dados"].__dict__
                especialidade = self.especialidade_service.consultar(codigo_especialidade)["dados"].__dict__
                total += especialidade["valor_consulta"] + exame["valor_exame"]
        return total