from app.repository.PacienteRepository import PacienteRepository
from app.models.Paciente import Paciente
# Necessário para verificar a chave estrangeira (Código da Cidade)
from app.services.CidadeService import CidadeService


class PacienteService:
    """Gerencia as regras de negócio para a entidade Paciente."""

    def __init__(self):
        self.repo = PacienteRepository()
        # Inicializa o serviço de Cidades para realizar validações de chave estrangeira
        self.cidade_service = CidadeService()

    def incluir(self, codigo_paciente, nome, data_nascimento, endereco,
                telefone, codigo_cidade, peso, altura):

        # 1. VALIDAÇÃO: Chave duplicada
        if self.repo.buscar_por_chave(codigo_paciente):
            return {"status": "ERRO", "mensagem": f"Código do Paciente {codigo_paciente} já está cadastrado."}

        # 2. VALIDAÇÃO: Chave Estrangeira (Cidade)
        if not self.cidade_service.consultar(codigo_cidade).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Cidade com código {codigo_cidade} não encontrada. O paciente deve estar vinculado a uma cidade existente."}

        # 3. VALIDAÇÃO: Campos obrigatórios (simplificado)
        if not all([nome, data_nascimento, codigo_cidade, peso, altura]):
            return {"status": "ERRO",
                    "mensagem": "Nome, Data de Nascimento, Cód. Cidade, Peso e Altura são obrigatórios."}

        # 4. CRIAÇÃO e INCLUSÃO
        novo_paciente = Paciente(codigo_paciente, nome, data_nascimento, endereco,
                                 telefone, codigo_cidade, peso, altura)
        self.repo.incluir_registro(novo_paciente)

        return {"status": "SUCESSO", "mensagem": f"Paciente {nome} (Cód: {codigo_paciente}) incluído."}

    def consultar(self, codigo_paciente):
        # BUSCA
        paciente = self.repo.buscar_por_chave(codigo_paciente)
        if paciente:
            return {"status": "SUCESSO", "dados": paciente.to_dict()}
        return {"status": "ERRO", "mensagem": f"Paciente {codigo_paciente} não encontrado."}

    def alterar(self, codigo_paciente, nome=None, data_nascimento=None, endereco=None,
                telefone=None, codigo_cidade=None, peso=None, altura=None):

        paciente = self.repo.buscar_por_chave(codigo_paciente)
        if paciente is None:
            return {"status": "ERRO", "mensagem": f"Paciente {codigo_paciente} não encontrado para alteração."}

        # Validação da Chave Estrangeira ao alterar
        if codigo_cidade is not None and not self.cidade_service.consultar(codigo_cidade).get("dados"):
            return {"status": "ERRO",
                    "mensagem": f"Cidade com código {codigo_cidade} não encontrada. Alteração cancelada."}

        # Aplicar modificações (mantendo o código/chave)
        paciente.nome = nome if nome is not None else paciente.nome
        paciente.data_nascimento = data_nascimento if data_nascimento is not None else paciente.data_nascimento
        paciente.endereco = endereco if endereco is not None else paciente.endereco
        paciente.telefone = telefone if telefone is not None else paciente.telefone
        paciente.codigo_cidade = codigo_cidade if codigo_cidade is not None else paciente.codigo_cidade
        paciente.peso = peso if peso is not None else paciente.peso
        paciente.altura = altura if altura is not None else paciente.altura

        # Persistir a alteração em disco
        self.repo.salvar_dados()

        return {"status": "SUCESSO", "mensagem": f"Paciente {codigo_paciente} alterado com sucesso."}

    def excluir(self, codigo_paciente):
        # EXCLUSÃO
        if self.repo.excluir_registro(codigo_paciente):
            return {"status": "SUCESSO", "mensagem": f"Paciente {codigo_paciente} excluído."}
        return {"status": "ERRO", "mensagem": f"Paciente {codigo_paciente} não encontrado."}

    def listar_ordenado(self):
        # LISTAGEM ORDENADA
        # O Repositório já retorna a lista ordenada pela ABB
        return self.repo.listar_todos_ordenado()

    def proximo_codigo(self) -> int:
        """Retorna o próximo código sequencial de paciente disponível."""
        pacientes = self.repo.listar_todos_ordenado()
        if not pacientes:
            return 1  # Inicia em 1 se não houver registros
        # Retorna o maior código + 1
        return max(p.codigo_paciente for p in pacientes) + 1