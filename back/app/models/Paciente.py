
class Paciente:

    def __init__(self, codigo_paciente: int, nome: str, data_nascimento: str,
                 endereco: str, telefone: str, codigo_cidade: int,
                 peso: float, altura: float):
        self.codigo_paciente = codigo_paciente
        self.nome = nome
        self.data_nascimento = data_nascimento
        self.endereco = endereco
        self.telefone = telefone
        self.codigo_cidade = codigo_cidade
        self.peso = peso
        self.altura = altura

    def __str__(self):
        return (f"Cód Paciente: {self.codigo_paciente}, Nome: {self.nome}, "
                f"Nascimento: {self.data_nascimento}, Cidade Cód: {self.codigo_cidade}, "
                f"IMC: {self.calcular_imc():.2f}")

    def calcular_imc(self):
        if self.altura and self.altura > 0:
            return self.peso / (self.altura ** 2)
        return 0.0

    def to_dict(self):
        return {
            "codigo_paciente": self.codigo_paciente,
            "nome": self.nome,
            "data_nascimento": self.data_nascimento,
            "endereco": self.endereco,
            "telefone": self.telefone,
            "codigo_cidade": self.codigo_cidade,
            "peso": self.peso,
            "altura": self.altura,
            "imc": self.calcular_imc()
        }
