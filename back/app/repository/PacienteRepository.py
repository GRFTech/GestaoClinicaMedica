from app.repository.BaseRepository import BaseRepository

class PacienteRepository(BaseRepository):

    def __init__(self):

        super().__init__(nome_base="pacientes", chave_primaria_atributo="codigo_paciente")
