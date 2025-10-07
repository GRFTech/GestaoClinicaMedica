from app.repository.BaseRepository import BaseRepository

class ConsultaRepository(BaseRepository):

    def __init__(self):

        super().__init__(nome_base="consultas", chave_primaria_atributo="codigo_consulta")
    