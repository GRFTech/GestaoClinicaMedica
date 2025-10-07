

class Diaria:

    def __init__(self, codigo_dia: int, codigo_especialidade: int, quantidade_consultas: int = 0):
        self.codigo_dia = codigo_dia
        self.codigo_especialidade = codigo_especialidade
        self.quantidade_consultas = quantidade_consultas
        self.chave_composta = self._gerar_chave_composta()

    def _gerar_chave_composta(self):
        return f"{self.codigo_dia}-{self.codigo_especialidade}"

    def __str__(self):
        return (f"Cód Dia: {self.codigo_dia}, Cód Esp: {self.codigo_especialidade}, "
                f"Qtd Consultas: {self.quantidade_consultas}")

    def to_dict(self):

        return {
            "codigo_dia": self.codigo_dia,
            "codigo_especialidade": self.codigo_especialidade,
            "quantidade_consultas": self.quantidade_consultas,
            "chave_composta": self.chave_composta
        }


    def incrementar(self):
        self.quantidade_consultas += 1

    def decrementar(self):
        if self.quantidade_consultas > 0:
            self.quantidade_consultas -= 1
