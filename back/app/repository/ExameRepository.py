from app.repository.BaseRepository import BaseRepository

class ExameRepository(BaseRepository):

    def __init__(self):

        super().__init__(nome_base="exames", chave_primaria_atributo="codigo_exame")
