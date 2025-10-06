from app.repository.BaseRepository import BaseRepository

class ConsultaRepository(BaseRepository):
    """
    Repositório específico para a entidade Consulta.
    Herda toda a lógica de persistência e indexação (ABB) do BaseRepository.
    """
    def __init__(self):
        # 1. Define o nome do arquivo: 'consultas.dat'
        # 2. Define o atributo que será a chave primária para a ABB: 'codigo_consulta'
        super().__init__(nome_base="consultas", chave_primaria_atributo="codigo_consulta")
    