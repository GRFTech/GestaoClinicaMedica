class Consulta:
    def __init__(self, codigo_consulta, codigo_paciente, codigo_medico, codigo_exame, data, hora):
        self.codigo_consulta = int(codigo_consulta)
        self.codigo_paciente = int(codigo_paciente)
        self.codigo_medico = int(codigo_medico)
        self.codigo_exame = int(codigo_exame)
        self.data = str(data) # Formato 'DD/MM/AAAA'
        self.hora = str(hora) # Formato 'HH:MM'