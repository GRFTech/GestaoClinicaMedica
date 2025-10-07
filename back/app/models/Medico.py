
class Medico:

    def __init__(self, codigo_medico: int, nome: str, endereco: str, telefone: str, codigo_cidade: int, codigo_especialidade: int):
        self.codigo_medico = codigo_medico
        self.nome = nome
        self.endereco = endereco
        self.telefone = telefone
        self.codigo_cidade = codigo_cidade
        self.codigo_especialidade = codigo_especialidade

    def __str__(self):
        return (f"Cód Médico: {self.codigo_medico}, Nome: {self.nome}, Endereço: {self.endereco}, "
                f"Tel: {self.telefone}, Cód Cidade: {self.codigo_cidade}, Cód Esp.: {self.codigo_especialidade}")

    def to_dict(self):
        return {
            "codigo_medico": self.codigo_medico,
            "nome": self.nome,
            "endereco": self.endereco,
            "telefone": self.telefone,
            "codigo_cidade": self.codigo_cidade,
            "codigo_especialidade": self.codigo_especialidade
        }
