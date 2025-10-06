# app/models/Medico.py
class Medico:
    """Representa a entidade Médico, associada a uma Cidade e Especialidade, incluindo Endereço e Telefone."""

    def __init__(self, codigo_medico: int, nome: str, endereco: str, telefone: str, codigo_cidade: int, codigo_especialidade: int):
        self.codigo_medico = codigo_medico
        self.nome = nome
        self.endereco = endereco # <--- NOVO CAMPO ADICIONADO
        self.telefone = telefone # <--- NOVO CAMPO ADICIONADO
        self.codigo_cidade = codigo_cidade  # Chave Estrangeira (FK) para Cidade
        self.codigo_especialidade = codigo_especialidade # Chave Estrangeira (FK) para Especialidade

    def __str__(self):
        """Retorna uma representação legível do objeto Medico."""
        return (f"Cód Médico: {self.codigo_medico}, Nome: {self.nome}, Endereço: {self.endereco}, "
                f"Tel: {self.telefone}, Cód Cidade: {self.codigo_cidade}, Cód Esp.: {self.codigo_especialidade}")

    def to_dict(self):
        """Retorna um dicionário com os atributos do médico."""
        return {
            "codigo_medico": self.codigo_medico,
            "nome": self.nome,
            "endereco": self.endereco, # <--- NOVO CAMPO ADICIONADO
            "telefone": self.telefone, # <--- NOVO CAMPO ADICIONADO
            "codigo_cidade": self.codigo_cidade,
            "codigo_especialidade": self.codigo_especialidade
        }
