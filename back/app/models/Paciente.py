class Paciente:
    def __init__(self, codigo_paciente, nome, data_nascimento, endereco, telefone, codigo_cidade, peso, altura):
        self.codigo_paciente = int(codigo_paciente)
        self.nome = str(nome)
        self.data_nascimento = str(data_nascimento)
        self.endereco = str(endereco)
        self.telefone = str(telefone)
        self.codigo_cidade = int(codigo_cidade)
        self.peso = float(peso)
        self.altura = float(altura)