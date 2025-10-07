from datetime import datetime, date


class FaturamentoService:
    def __init__(self, consulta_service, medico_service, especialidade_service, exame_service):
        self.consulta_service = consulta_service
        self.medico_service = medico_service
        self.especialidade_service = especialidade_service
        self.exame_service = exame_service

    def _calcular_valor_consulta(self, codigo_medico, codigo_exame):
        """
        Função auxiliar para calcular o valor total (Especialidade + Exame)
        de uma consulta, tratando erros de dados ausentes e desestruturando objetos.
        Retorna o valor ou 0.0 se não for possível calcular.
        """
        valor_total = 0.0


        medico_res = self.medico_service.consultar(codigo_medico)
        if medico_res["status"] == "ERRO":
            return 0.0
        medico = medico_res["dados"]
        codigo_especialidade = medico.get("codigo_especialidade")


        esp_res = self.especialidade_service.consultar(codigo_especialidade)
        if esp_res["status"] == "SUCESSO":

            especialidade_dict = esp_res["dados"].__dict__
            valor_consulta = especialidade_dict.get("valor_consulta", 0.0)
            valor_total += valor_consulta


        exame_res = self.exame_service.consultar(codigo_exame)
        if exame_res["status"] == "SUCESSO":
            exame_dict = exame_res["dados"].__dict__
            valor_exame = exame_dict.get("valor_exame", 0.0)
            valor_total += valor_exame

        return valor_total



    def faturamento_por_dia(self, data_str):
        """Calcula o faturamento total para um dia específico (DD/MM/AAAA)."""
        total = 0.0
        consultas = self.consulta_service.listar_ordenado()

        for c in consultas:
            if c.data == data_str:
                total += self._calcular_valor_consulta(c.codigo_medico, c.codigo_exame)

        return total



    def faturamento_por_periodo(self, data_inicio_str, data_fim_str):
        """
        Calcula o faturamento total entre data_inicio e data_fim (inclusive).
        data_inicio e data_fim são strings no formato DD/MM/AAAA.
        """
        total = 0.0
        consultas = self.consulta_service.listar_ordenado()


        try:
            data_inicio = datetime.strptime(data_inicio_str, "%d/%m/%Y").date()
            data_fim = datetime.strptime(data_fim_str, "%d/%m/%Y").date()
        except ValueError:
            print("[ERRO FATURAMENTO] Formato de data inválido (Use DD/MM/AAAA).")
            return 0.0

        for c in consultas:
            try:

                data_consulta = datetime.strptime(c.data, "%d/%m/%Y").date()
            except ValueError:
                continue


            if data_inicio <= data_consulta <= data_fim:
                total += self._calcular_valor_consulta(c.codigo_medico, c.codigo_exame)

        return total



    def faturamento_por_medico(self, codigo_medico):
        """Calcula o faturamento total gerado por um médico específico."""
        total = 0.0
        consultas = self.consulta_service.listar_ordenado()

        for c in consultas:
            if c.codigo_medico == codigo_medico:
                total += self._calcular_valor_consulta(c.codigo_medico, c.codigo_exame)

        return total



    def faturamento_por_especialidade(self, codigo_especialidade):
        """Calcula o faturamento total gerado por uma especialidade específica."""
        total = 0.0
        consultas = self.consulta_service.listar_ordenado()

        for c in consultas:
            medico_res = self.medico_service.consultar(c.codigo_medico)

            if medico_res["status"] == "SUCESSO":
                medico = medico_res["dados"]

                if medico.get("codigo_especialidade") == codigo_especialidade:
                    total += self._calcular_valor_consulta(c.codigo_medico, c.codigo_exame)

        return total
