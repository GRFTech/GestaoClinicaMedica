from app.repository.BaseRepository import BaseRepository

class ExameRepository(BaseRepository):
    """
    Repositório específico para a entidade Exame.
    Herda toda a lógica de persistência e indexação (ABB) do BaseRepository.
    """
    def __init__(self):
        # 1. Define o nome do arquivo: 'exames.dat'
        # 2. Define o atributo que será a chave primária para a ABB: 'codigo_exame'
        super().__init__(nome_base="exames", chave_primaria_atributo="codigo_exame")
