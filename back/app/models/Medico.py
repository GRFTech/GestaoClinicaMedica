class Medico:
    def __init__(self, codigo_medico, nome, endereco, telefone, codigo_cidade, codigo_especialidade):
        self.codigo_medico = int(codigo_medico)
        self.nome = str(nome)
        self.endereco = str(endereco)
        self.telefone = str(telefone)
        self.codigo_cidade = int(codigo_cidade)
        self.codigo_especialidade = int(codigo_especialidade)