from app.repository.BaseRepository import BaseRepository

class MedicoRepository(BaseRepository):
    """
    Repositório específico para a entidade Médico.
    Herda toda a lógica de persistência e indexação (ABB) do BaseRepository.
    """
    def __init__(self):
        # 1. Define o nome do arquivo: 'medicos.dat'
        # 2. Define o atributo que será a chave primária para a ABB: 'codigo_medico'
        super().__init__(nome_base="medicos", chave_primaria_atributo="codigo_medico")
