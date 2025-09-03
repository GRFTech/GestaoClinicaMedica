class Especialidade:
    def __init__(self, codigo_especialidade, descricao, valor_consulta, limite_diario):
        self.codigo_especialidade = int(codigo_especialidade)
        self.descricao = str(descricao)
        self.valor_consulta = float(valor_consulta)
        self.limite_diario = int(limite_diario)
