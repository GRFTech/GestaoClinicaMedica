from app.repository.MedicoRepository import MedicoRepository
from app.models.Medico import Medico
# Necessário para verificar as chaves estrangeiras
from app.services.CidadeService import CidadeService
from app.services.EspecialidadeService import EspecialidadeService


class MedicoService:
    """Gerencia as regras de negócio para a entidade Médico."""

    def __init__(self):
        self.repo = MedicoRepository()
        # Inicializa serviços para validação de chaves estrangeiras (FK)
        self.cidade_service = CidadeService()
        self.especialidade_service = EspecialidadeService()

    def incluir(self, codigo_medico, nome, endereco, telefone, codigo_cidade, codigo_especialidade):

        # 1. VALIDAÇÃO: Chave duplicada
        if self.repo.buscar_por_chave(codigo_medico):
            return {"status": "ERRO", "mensagem": f"Código do Médico {codigo_medico} já está cadastrado."}

        # 2. VALIDAÇÃO: Chave Estrangeira (Cidade)
        if not self.cidade_service.consultar(codigo_cidade).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Cidade com código {codigo_cidade} não encontrada. O médico deve estar vinculado a uma cidade existente."}

        # 3. VALIDAÇÃO: Chave Estrangeira (Especialidade)
        if not self.especialidade_service.consultar(codigo_especialidade).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Especialidade com código {codigo_especialidade} não encontrada. O médico deve ter uma especialidade válida."}

        # 4. VALIDAÇÃO: Campos obrigatórios (simplificado)
        if not all([nome, endereco, telefone]):
            return {"status": "ERRO", "mensagem": "Nome, Endereço e Telefone são obrigatórios."}

        # 5. CRIAÇÃO e INCLUSÃO
        novo_medico = Medico(codigo_medico, nome, endereco, telefone, codigo_cidade, codigo_especialidade)
        self.repo.incluir_registro(novo_medico)

        return {"status": "SUCESSO", "mensagem": f"Médico(a) {nome} (Cód: {codigo_medico}) incluído."}

    def consultar(self, codigo_medico):
        # BUSCA
        medico = self.repo.buscar_por_chave(codigo_medico)
        if medico:
            return {"status": "SUCESSO", "dados": medico.to_dict()}
        return {"status": "ERRO", "mensagem": f"Médico {codigo_medico} não encontrado."}

    def alterar(self, codigo_medico, nome=None, endereco=None, telefone=None, codigo_cidade=None,
                codigo_especialidade=None):

        medico = self.repo.buscar_por_chave(codigo_medico)
        if medico is None:
            return {"status": "ERRO", "mensagem": f"Médico {codigo_medico} não encontrado para alteração."}

        # Validação da Chave Estrangeira (Cidade)
        if codigo_cidade is not None and not self.cidade_service.consultar(codigo_cidade).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Cidade com código {codigo_cidade} não encontrada. Alteração cancelada."}

        # Validação da Chave Estrangeira (Especialidade)
        if codigo_especialidade is not None and not self.especialidade_service.consultar(codigo_especialidade).get(
                "dados"):
            return {"status": "ERRO",
                    "mensagem": f"Especialidade com código {codigo_especialidade} não encontrada. Alteração cancelada."}

        # Aplicar modificações
        medico.nome = nome if nome is not None else medico.nome
        medico.endereco = endereco if endereco is not None else medico.endereco
        medico.telefone = telefone if telefone is not None else medico.telefone
        medico.codigo_cidade = codigo_cidade if codigo_cidade is not None else medico.codigo_cidade
        medico.codigo_especialidade = codigo_especialidade if codigo_especialidade is not None else medico.codigo_especialidade

        # Persistir a alteração em disco
        self.repo.salvar_dados()

        return {"status": "SUCESSO", "mensagem": f"Médico {codigo_medico} alterado com sucesso."}

    def excluir(self, codigo_medico):
        # EXCLUSÃO
        if self.repo.excluir_registro(codigo_medico):
            return {"status": "SUCESSO", "mensagem": f"Médico {codigo_medico} excluído."}
        return {"status": "ERRO", "mensagem": f"Médico {codigo_medico} não encontrado."}

    def listar_ordenado(self):
        # LISTAGEM ORDENADA
        return self.repo.listar_todos_ordenado()
