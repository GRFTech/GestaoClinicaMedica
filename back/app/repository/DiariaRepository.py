from app.repository.BaseRepository import BaseRepository

class DiariaRepository(BaseRepository):
    """
    Repositório específico para a entidade Diária.
    Utiliza a 'chave_composta' (AAAAMMDD-CódEspecialidade) como chave primária
    para a indexação em Árvore Binária de Busca (ABB).
    """
    def __init__(self):
        # O atributo para a chave primária da ABB é a chave_composta
        super().__init__(nome_base="diarias", chave_primaria_atributo="chave_composta")
