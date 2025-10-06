# --- Atributos ---
# Pacientes: Código do Paciente, Nome, Data Nascimento, Endereço, Telefone,
#            Código da Cidade, Peso, Altura

class Paciente:
    """Representa a entidade Paciente no sistema."""

    def __init__(self, codigo_paciente: int, nome: str, data_nascimento: str,
                 endereco: str, telefone: str, codigo_cidade: int,
                 peso: float, altura: float):
        self.codigo_paciente = codigo_paciente
        self.nome = nome
        self.data_nascimento = data_nascimento  # Formato esperado: DD/MM/AAAA
        self.endereco = endereco
        self.telefone = telefone
        self.codigo_cidade = codigo_cidade  # Chave estrangeira para Cidade
        self.peso = peso
        self.altura = altura

    def __str__(self):
        """Retorna uma representação legível do objeto Paciente."""
        return (f"Cód Paciente: {self.codigo_paciente}, Nome: {self.nome}, "
                f"Nascimento: {self.data_nascimento}, Cidade Cód: {self.codigo_cidade}, "
                f"IMC: {self.calcular_imc():.2f}")

    def calcular_imc(self):
        """Calcula o Índice de Massa Corporal (IMC)."""
        # IMC = peso / (altura * altura)
        # Verifica se altura é positiva para evitar divisão por zero
        if self.altura and self.altura > 0:
            return self.peso / (self.altura ** 2)
        return 0.0

    def to_dict(self):
        """Retorna um dicionário com os atributos do paciente, útil para serialização."""
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
