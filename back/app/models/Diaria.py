class Diaria:
    def __init__(self, codigo_dia, codigo_especialidade, quantidade_consultas):
        self.codigo_dia = int(codigo_dia) # Formato AAAAMMDD
        self.codigo_especialidade = int(codigo_especialidade)
        self.quantidade_consultas = int(quantidade_consultas)