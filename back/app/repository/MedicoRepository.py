from app.repository.BaseRepository import BaseRepository

class MedicoRepository(BaseRepository):

    def __init__(self):

        super().__init__(nome_base="medicos", chave_primaria_atributo="codigo_medico")
