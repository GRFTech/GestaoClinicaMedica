# --- Atributos ---
# Exames: Código do Exame, Descrição, Código Especialidade, Valor do Exame

class Exame:
    """Representa a entidade Exame no sistema."""

    def __init__(self, codigo_exame: int, descricao: str, codigo_especialidade: int, valor_exame: float):
        self.codigo_exame = codigo_exame
        self.descricao = descricao
        self.codigo_especialidade = codigo_especialidade  # Chave estrangeira para Especialidade
        self.valor_exame = valor_exame  # Valor cobrado pelo exame

    def __str__(self):
        """Retorna uma representação legível do objeto Exame."""
        return (f"Cód Exame: {self.codigo_exame}, Descrição: {self.descricao}, "
                f"Especialidade Cód: {self.codigo_especialidade}, Valor: R$ {self.valor_exame:.2f}")

    def to_dict(self):
        """Retorna um dicionário com os atributos do exame."""
        return {
            "codigo_exame": self.codigo_exame,
            "descricao": self.descricao,
            "codigo_especialidade": self.codigo_especialidade,
            "valor_exame": self.valor_exame
        }
