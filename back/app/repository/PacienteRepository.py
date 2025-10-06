from app.repository.BaseRepository import BaseRepository

class PacienteRepository(BaseRepository):
    """
    Repositório específico para a entidade Paciente.
    Herda toda a lógica de persistência e indexação (ABB) do BaseRepository.
    """
    def __init__(self):
        # Chama o construtor da classe base (BaseRepository)
        # 1. Define o nome do arquivo: 'pacientes.dat'
        # 2. Define o atributo que será a chave primária para a ABB: 'codigo_paciente'
        super().__init__(nome_base="pacientes", chave_primaria_atributo="codigo_paciente")
