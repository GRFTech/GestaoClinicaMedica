# --- Atributos ---
# Especialidades: Código da Especialidade, Descrição, Valor da Consulta, Limite Diário

class Especialidade:
    """Representa a entidade Especialidade no sistema."""

    def __init__(self, codigo_especialidade: int, descricao: str, valor_consulta: float, limite_diario: int):
        self.codigo_especialidade = codigo_especialidade
        self.descricao = descricao
        self.valor_consulta = valor_consulta  # Valor da consulta cobrado por essa especialidade
        self.limite_diario = limite_diario  # Número máximo de consultas por dia

    def __str__(self):
        """Retorna uma representação legível do objeto Especialidade."""
        return (f"Cód Especialidade: {self.codigo_especialidade}, Descrição: {self.descricao}, "
                f"Valor: R$ {self.valor_consulta:.2f}, Limite Diário: {self.limite_diario}")

    def to_dict(self):
        """Retorna um dicionário com os atributos da especialidade."""
        return {
            "codigo_especialidade": self.codigo_especialidade,
            "descricao": self.descricao,
            "valor_consulta": self.valor_consulta,
            "limite_diario": self.limite_diario
        }
