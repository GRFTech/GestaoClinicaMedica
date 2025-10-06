from app.repository.BaseRepository import BaseRepository

class EspecialidadeRepository(BaseRepository):
    """
    Repositório específico para a entidade Especialidade.
    Herda toda a lógica de persistência e indexação (ABB) do BaseRepository.
    """
    def __init__(self):
        # 1. Define o nome do arquivo: 'especialidades.dat'
        # 2. Define o atributo que será a chave primária para a ABB: 'codigo_especialidade'
        super().__init__(nome_base="especialidades", chave_primaria_atributo="codigo_especialidade")
