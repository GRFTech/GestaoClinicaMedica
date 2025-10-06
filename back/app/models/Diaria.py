# --- Atributos ---
# Diárias: Código do Dia (AAAAMMDD), Código da Especialidade, Quantidade de Consultas

class Diaria:
    """Representa a contagem diária de consultas por Especialidade."""

    def __init__(self, codigo_dia: int, codigo_especialidade: int, quantidade_consultas: int = 0):
        self.codigo_dia = codigo_dia  # Código do Dia (AAAAMMDD)
        self.codigo_especialidade = codigo_especialidade  # FK Especialidade
        self.quantidade_consultas = quantidade_consultas  # Quantidade atual de consultas

        # Chave Primária Composta/Sintética para a ABB: 'AAAAMMDD-CódEspecialidade'
        self.chave_composta = self._gerar_chave_composta()

    def _gerar_chave_composta(self):
        """Gera a chave primária composta no formato string."""
        return f"{self.codigo_dia}-{self.codigo_especialidade}"

    def __str__(self):
        """Retorna uma representação legível do objeto Diaria."""
        return (f"Cód Dia: {self.codigo_dia}, Cód Esp: {self.codigo_especialidade}, "
                f"Qtd Consultas: {self.quantidade_consultas}")

    def to_dict(self):
        """Retorna um dicionário com os atributos da diária."""
        return {
            "codigo_dia": self.codigo_dia,
            "codigo_especialidade": self.codigo_especialidade,
            "quantidade_consultas": self.quantidade_consultas,
            "chave_composta": self.chave_composta  # Necessário para o BaseRepository
        }

    # Métodos utilitários
    def incrementar(self):
        """Incrementa a contagem de consultas."""
        self.quantidade_consultas += 1

    def decrementar(self):
        """Decrementa a contagem de consultas."""
        if self.quantidade_consultas > 0:
            self.quantidade_consultas -= 1
