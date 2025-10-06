# app/models/Cidade.py
class Cidade:
    def __init__(self, codigo, descricao, estado):
        self.codigo = codigo
        self.descricao = descricao
        self.estado = estado

    def to_dict(self):
        return {
            "codigo": self.codigo,
            "descricao": self.descricao,
            "estado": self.estado
        }

    def __str__(self):
        return f"Cód: {self.codigo} | Desc: {self.descricao} | UF: {self.estado}"
