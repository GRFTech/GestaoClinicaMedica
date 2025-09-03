class Exame:
    def __init__(self, codigo_exame, descricao, codigo_especialidade, valor_exame):
        self.codigo_exame = int(codigo_exame)
        self.descricao = str(descricao)
        self.codigo_especialidade = int(codigo_especialidade)
        self.valor_exame = float(valor_exame)