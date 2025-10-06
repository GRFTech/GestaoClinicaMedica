# --- Atributos ---
# Consultas: Código da Consulta, Código do Paciente, Código do Médico, Código do Exame, Data, Hora

class Consulta:
    """Representa o agendamento de uma Consulta/Exame no sistema."""

    def __init__(self, codigo_consulta: int, codigo_paciente: int, codigo_medico: int, codigo_exame: int, data: str,
                 hora: str):
        self.codigo_consulta = codigo_consulta  # Chave Primária
        self.codigo_paciente = codigo_paciente  # FK Paciente
        self.codigo_medico = codigo_medico  # FK Médico
        self.codigo_exame = codigo_exame  # FK Exame
        self.data = data  # Data da consulta (DD/MM/AAAA)
        self.hora = hora  # Hora da consulta (HH:MM)

    def __str__(self):
        """Retorna uma representação legível do objeto Consulta."""
        return (f"Cód Consulta: {self.codigo_consulta}, Paciente Cód: {self.codigo_paciente}, "
                f"Médico Cód: {self.codigo_medico}, Exame Cód: {self.codigo_exame}, "
                f"Data/Hora: {self.data} às {self.hora}")

    def to_dict(self):
        """Retorna um dicionário com os atributos da consulta."""
        return {
            "codigo_consulta": self.codigo_consulta,
            "codigo_paciente": self.codigo_paciente,
            "codigo_medico": self.codigo_medico,
            "codigo_exame": self.codigo_exame,
            "data": self.data,
            "hora": self.hora
        }
