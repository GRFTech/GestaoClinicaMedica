

class Consulta:

    def __init__(self, codigo_consulta: int, codigo_paciente: int, codigo_medico: int, codigo_exame: int, data: str,
                 hora: str):
        self.codigo_consulta = codigo_consulta
        self.codigo_paciente = codigo_paciente
        self.codigo_medico = codigo_medico
        self.codigo_exame = codigo_exame
        self.data = data
        self.hora = hora

    def __str__(self):

        return (f"Cód Consulta: {self.codigo_consulta}, Paciente Cód: {self.codigo_paciente}, "
                f"Médico Cód: {self.codigo_medico}, Exame Cód: {self.codigo_exame}, "
                f"Data/Hora: {self.data} às {self.hora}")

    def to_dict(self):

        return {
            "codigo_consulta": self.codigo_consulta,
            "codigo_paciente": self.codigo_paciente,
            "codigo_medico": self.codigo_medico,
            "codigo_exame": self.codigo_exame,
            "data": self.data,
            "hora": self.hora
        }
