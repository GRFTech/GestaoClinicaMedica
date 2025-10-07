from app.repository.BaseRepository import BaseRepository

class DiariaRepository(BaseRepository):

    def __init__(self):

        super().__init__(nome_base="diarias", chave_primaria_atributo="chave_composta")
