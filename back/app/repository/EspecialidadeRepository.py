from app.repository.BaseRepository import BaseRepository

class EspecialidadeRepository(BaseRepository):

    def __init__(self):

        super().__init__(nome_base="especialidades", chave_primaria_atributo="codigo_especialidade")
