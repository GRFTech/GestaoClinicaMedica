from app.repository.BaseRepository import BaseRepository


class CidadeRepository(BaseRepository):

    def __init__(self):
        super().__init__(nome_base="cidades", chave_primaria_atributo="codigo")


