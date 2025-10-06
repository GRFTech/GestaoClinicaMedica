from app.repository.BaseRepository import BaseRepository
# Nota: Você precisaria da classe Cidade em outro lugar (app/model)
# mas o repositório em si não precisa mais dela para funcionar,
# apenas para tipagem, se estivéssemos usando tipagem forte em Python.

class CidadeRepository(BaseRepository):
    """
    Repositório específico para a entidade Cidade.
    Herdando toda a lógica de CRUD e ABB da BaseRepository.
    """
    def __init__(self):
        # 1. Herda tudo de BaseRepository.
        # 2. Define o nome do arquivo de dados: 'cidades.dat'
        # 3. Define que a chave primária do objeto Cidade é o atributo 'codigo'.
        super().__init__(nome_base="cidades", chave_primaria_atributo="codigo")

# O código original de persistência e ABB foi movido para BaseRepository.py
