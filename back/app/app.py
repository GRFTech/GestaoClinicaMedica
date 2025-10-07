from http.cookiejar import debug

from flask import Flask, request

app = Flask(__name__)




@app.after_request
def add_cors_headers(response):
    """
    Função que adiciona os cabeçalhos CORS a TODAS as respostas do servidor.
    Isso 'desabilita' o bloqueio de CORS pelo navegador.
    """


    response.headers['Access-Control-Allow-Origin'] = '*'


    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'


    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'


    response.headers['Access-Control-Max-Age'] = '3600'

    return response



@app.before_request
def preflight():
    """Lida com as requisições OPTIONS do navegador."""
    if request.method == 'OPTIONS':

        return '', 204


from app.controller.CidadeController import cidade_bp
from app.controller.ConsultaController import consulta_bp
from app.controller.DiariaController import diaria_bp
from app.controller.EspecialidadeController import especialidade_bp
from app.controller.ExameController import exame_bp
from app.controller.FaturamentoController import faturamento_bp
from app.controller.MedicoController import medico_bp
from app.controller.PacienteController import paciente_bp


app.register_blueprint(cidade_bp, url_prefix='/api')
app.register_blueprint(consulta_bp, url_prefix='/api')
app.register_blueprint(diaria_bp, url_prefix='/api')
app.register_blueprint(especialidade_bp, url_prefix='/api')
app.register_blueprint(exame_bp, url_prefix='/api')
app.register_blueprint(faturamento_bp, url_prefix='/api')
app.register_blueprint(medico_bp, url_prefix='/api')
app.register_blueprint(paciente_bp, url_prefix='/api')

import os
import sys

from app.services.CidadeService import CidadeService
from app.services.PacienteService import PacienteService
from app.services.EspecialidadeService import EspecialidadeService
from app.services.MedicoService import MedicoService
from app.services.ExameService import ExameService
from app.services.ConsultaService import ConsultaService
from app.services.DiariaService import DiariaService
from app.services.FaturamentoService import FaturamentoService


class App:
    def __init__(self):
        self.cidade_service = CidadeService()
        self.paciente_service = PacienteService()
        self.especialidade_service = EspecialidadeService()
        self.medico_service = MedicoService()
        self.exame_service = ExameService()
        self.consulta_service = ConsultaService()
        self.diaria_service = DiariaService()
        self.faturamento_service = FaturamentoService(
            self.consulta_service,
            self.medico_service,
            self.especialidade_service,
            self.exame_service
        )

        self.menus_crud = {
            "1": self.menu_cidades_crud,
            "2": self.menu_pacientes_crud,
            "3": self.menu_especialidades_crud,
            "4": self.menu_medicos_crud,
            "5": self.menu_exames_crud,
            "6": self.menu_consultas_crud,
            "7": self.menu_diarias_crud,
            "8": self.menu_faturamento,
        }

    def limpar_tela(self):
        """Tenta limpar o terminal para melhor visualização."""
        os.system('cls' if os.name == 'nt' else 'clear')

    def exibir_menu_principal(self):
        """MENU PRINCIPAL (Seleção de Tabela)"""
        self.limpar_tela()
        print("\n" + "=" * 60)
        print(" SISTEMA DE ARQUIVOS INDEXADOS - CLÍNICA MÉDICA ")
        print("=" * 60)
        print("1) Cidades")
        print("2) Pacientes")
        print("3) Especialidades (Define o Limite Diário)")
        print("4) Médicos")
        print("5) Exames")
        print("6) Consultas (Verificação e Consumo do Limite Diário)")
        print("7) Diárias (Manutenção da Contagem de Limites)")
        print("8) Faturamento da clínica")
        print("0) Sair")
        print("=" * 60)

    def run(self):
        """Loop principal do programa."""
        while True:
            self.exibir_menu_principal()
            opcao = input("Escolha uma opção: ")

            if opcao in self.menus_crud:
                self.menus_crud[opcao]()
            elif opcao == '0':
                print("\nEncerrando o sistema.")
                break
            else:
                print("Opção inválida.")
                input("Pressione Enter para continuar...")


    def _obter_codigo_int(self, entidade, acao):
        """Função genérica para obter códigos numéricos e tratar erros."""
        while True:
            try:

                artigo = 'a' if entidade in ['cidade', 'especialidade', 'consulta', 'diária'] else 'o'
                return int(input(f"Digite o código d{artigo} {entidade} para {acao}: "))
            except ValueError:
                print("[ERRO] Código inválido, deve ser número inteiro.")

    def _obter_codigo_cidade(self, acao):
        return self._obter_codigo_int("cidade", acao)

    def _obter_codigo_paciente(self, acao):
        return self._obter_codigo_int("paciente", acao)

    def _obter_codigo_medico(self, acao):
        return self._obter_codigo_int("médico", acao)

    def _obter_codigo_exame(self, acao):
        return self._obter_codigo_int("exame", acao)

    def _obter_codigo_especialidade(self, acao):
        return self._obter_codigo_int("especialidade", acao)

    def _obter_codigo_consulta(self, acao):
        return self._obter_codigo_int("consulta", acao)



    def menu_cidades_crud(self):
        while True:
            self.limpar_tela()
            print("\n" + "=" * 60)
            print("            CRUD - CIDADES")
            print("=" * 60)
            print("1) Incluir cidade")
            print("2) Consultar cidade")
            print("3) Alterar cidade")
            print("4) Excluir cidade")
            print("5) Listar cidades (ordenado por código)")
            print("0) Voltar")
            print("=" * 60)

            opcao = input("Escolha uma opção: ")


            if opcao == '1':
                codigo = self._obter_codigo_cidade("incluir")
                descricao = input("Digite a descrição da cidade: ").strip()
                estado = input("Digite o estado (UF): ").strip().upper()
                resultado = self.cidade_service.incluir(codigo, descricao, estado)
                print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '2':
                codigo = self._obter_codigo_cidade("consultar")
                resultado = self.cidade_service.consultar(codigo)
                if resultado["status"] == "SUCESSO":
                    cidade = resultado["dados"]
                    print(f"\n{cidade}")
                else:
                    print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '3':
                codigo = self._obter_codigo_cidade("alterar")
                nova_desc = input("Digite a nova descrição (ou deixe em branco p/ manter): ").strip()
                novo_estado = input("Digite o novo estado (UF, ou deixe em branco p/ manter): ").strip().upper()
                resultado = self.cidade_service.alterar(codigo, nova_desc, novo_estado)
                print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '4':
                codigo = self._obter_codigo_cidade("excluir")
                resultado = self.cidade_service.excluir(codigo)
                print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '5':
                cidades = self.cidade_service.listar_ordenado()
                if cidades:
                    print("\nLista de cidades cadastradas:\n")
                    for c in cidades:
                        print(c)
                else:
                    print("\nNenhuma cidade cadastrada.")
                input("\nPressione Enter para continuar...")


            elif opcao == '0':
                break

            else:
                print("\nOpção inválida.")
                input("Pressione Enter para continuar...")

    def menu_pacientes_crud(self):
        def diagnostico_imc(imc):
            if imc < 18.5:
                return "Abaixo do peso"
            elif 18.5 <= imc < 25:
                return "Peso normal"
            elif 25 <= imc < 30:
                return "Sobrepeso"
            else:
                return "Obesidade"

        while True:
            self.limpar_tela()
            print("\n" + "=" * 60)
            print("            CRUD - PACIENTES")
            print("=" * 60)
            print("1) Incluir paciente")
            print("2) Consultar paciente")
            print("3) Alterar paciente")
            print("4) Excluir paciente")
            print("5) Listar pacientes (ordenado por código)")
            print("0) Voltar")
            print("=" * 60)

            opcao = input("Escolha uma opção: ")


            if opcao == '1':
                codigo = self._obter_codigo_paciente("incluir")
                nome = input("Nome: ").strip()
                data_nascimento = input("Data Nascimento (DD/MM/AAAA): ").strip()
                endereco = input("Endereço: ").strip()
                telefone = input("Telefone: ").strip()
                codigo_cidade = self._obter_codigo_cidade("vincular")
                try:
                    peso = float(input("Peso (kg): "))
                    altura = float(input("Altura (m): "))
                except ValueError:
                    print("[ERRO] Peso e Altura devem ser números.")
                    input("Pressione Enter para continuar...")
                    continue

                resultado = self.paciente_service.incluir(codigo, nome, data_nascimento,
                                                          endereco, telefone,
                                                          codigo_cidade, peso, altura)
                print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '2':
                codigo = self._obter_codigo_paciente("consultar")
                resultado = self.paciente_service.consultar(codigo)
                if resultado["status"] == "SUCESSO":
                    paciente = resultado["dados"]
                    cidade_info = self.cidade_service.consultar(paciente["codigo_cidade"])
                    nome_cidade = cidade_info["dados"].descricao if cidade_info[
                                                                        "status"] == "SUCESSO" else "Cidade não encontrada"
                    uf_cidade = cidade_info["dados"].estado if cidade_info["status"] == "SUCESSO" else ""

                    imc = paciente["imc"]
                    diagnostico = diagnostico_imc(imc)

                    print("\n--- Dados do Paciente ---")
                    print(f"Código: {paciente['codigo_paciente']}")
                    print(f"Nome: {paciente['nome']}")
                    print(f"Data Nascimento: {paciente['data_nascimento']}")
                    print(f"Endereço: {paciente['endereco']}")
                    print(f"Telefone: {paciente['telefone']}")
                    print(f"Cidade: {nome_cidade} - {uf_cidade}")
                    print(f"Peso: {paciente['peso']} kg, Altura: {paciente['altura']} m")
                    print(f"IMC: {imc:.2f} ({diagnostico})")
                else:
                    print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '3':
                codigo = self._obter_codigo_paciente("alterar")
                nome = input("Novo Nome (ou deixe em branco para manter): ").strip() or None
                data_nascimento = input("Nova Data Nascimento (DD/MM/AAAA ou vazio): ").strip() or None
                endereco = input("Novo Endereço (ou vazio para manter): ").strip() or None
                telefone = input("Novo Telefone (ou vazio para manter): ").strip() or None

                cod_cidade_input = input("Novo Código da Cidade (ou vazio para manter): ").strip()
                codigo_cidade = int(cod_cidade_input) if cod_cidade_input else None

                try:
                    peso_input = input("Novo Peso (ou vazio para manter): ").strip()
                    peso = float(peso_input) if peso_input else None

                    altura_input = input("Nova Altura (ou vazio para manter): ").strip()
                    altura = float(altura_input) if altura_input else None
                except ValueError:
                    print("[ERRO] Peso e Altura devem ser números.")
                    input("Pressione Enter para continuar...")
                    continue

                resultado = self.paciente_service.alterar(codigo, nome, data_nascimento, endereco,
                                                          telefone, codigo_cidade, peso, altura)
                print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '4':
                codigo = self._obter_codigo_paciente("excluir")
                resultado = self.paciente_service.excluir(codigo)
                print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '5':
                pacientes = self.paciente_service.listar_ordenado()
                if pacientes:
                    print("\n--- Lista de Pacientes ---")
                    for p in pacientes:
                        cidade_info = self.cidade_service.consultar(p.codigo_cidade)
                        nome_cidade = cidade_info["dados"].descricao if cidade_info[
                                                                            "status"] == "SUCESSO" else "Cidade não encontrada"
                        uf_cidade = cidade_info["dados"].estado if cidade_info["status"] == "SUCESSO" else ""
                        imc = p.calcular_imc()
                        diag = diagnostico_imc(imc)
                        print(f"{p.codigo_paciente} | {p.nome} | {nome_cidade}-{uf_cidade} | IMC: {imc:.2f} ({diag})")
                else:
                    print("\nNenhum paciente cadastrado.")
                input("\nPressione Enter para continuar...")


            elif opcao == '0':
                break

            else:
                print("\nOpção inválida.")
                input("Pressione Enter para continuar...")

    def menu_especialidades_crud(self):
        while True:
            self.limpar_tela()
            print("\n" + "=" * 60)
            print("          CRUD - ESPECIALIDADES")
            print("=" * 60)
            print("1) Incluir especialidade")
            print("2) Consultar especialidade")
            print("3) Alterar especialidade")
            print("4) Excluir especialidade")
            print("5) Listar especialidades (ordenado por código)")
            print("0) Voltar")
            print("=" * 60)

            opcao = input("Escolha uma opção: ")


            if opcao == '1':
                codigo = self._obter_codigo_especialidade("incluir")
                descricao = input("Descrição: ").strip()
                try:
                    valor_consulta = float(input("Valor da Consulta: "))
                    limite_diario = int(input("Limite Diário: "))
                except ValueError:
                    print("[ERRO] Valor da Consulta deve ser número e Limite Diário deve ser inteiro.")
                    input("Pressione Enter para continuar...")
                    continue

                resultado = self.especialidade_service.incluir(codigo, descricao, valor_consulta, limite_diario)
                print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '2':
                codigo = self._obter_codigo_especialidade("consultar")
                resultado = self.especialidade_service.consultar(codigo)
                if resultado["status"] == "SUCESSO":
                    e = resultado["dados"]
                    print("\n--- Dados da Especialidade ---")
                    print(f"Código: {e.codigo_especialidade}")
                    print(f"Descrição: {e.descricao}")
                    print(f"Valor da Consulta: R$ {e.valor_consulta:.2f}")
                    print(f"Limite Diário: {e.limite_diario}")
                else:
                    print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '3':
                codigo = self._obter_codigo_especialidade("alterar")
                descricao = input("Nova Descrição (ou deixe em branco para manter): ").strip() or None

                valor_input = input("Novo Valor da Consulta (ou vazio para manter): ").strip()
                valor_consulta = float(valor_input) if valor_input else None

                limite_input = input("Novo Limite Diário (ou vazio para manter): ").strip()
                limite_diario = int(limite_input) if limite_input else None

                resultado = self.especialidade_service.alterar(codigo, descricao, valor_consulta, limite_diario)
                print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '4':
                codigo = self._obter_codigo_especialidade("excluir")
                resultado = self.especialidade_service.excluir(codigo)
                print(f"\n{resultado['mensagem']}")
                input("\nPressione Enter para continuar...")


            elif opcao == '5':
                especialidades = self.especialidade_service.listar_ordenado()
                if especialidades:
                    print("\n--- Lista de Especialidades ---")
                    for e in especialidades:
                        print(f"{e.codigo_especialidade} | {e.descricao} | "
                              f"R$ {e.valor_consulta:.2f} | Limite Diário: {e.limite_diario}")
                else:
                    print("\nNenhuma especialidade cadastrada.")
                input("\nPressione Enter para continuar...")


            elif opcao == '0':
                break

            else:
                print("\nOpção inválida.")
                input("Pressione Enter para continuar...")

    def menu_medicos_crud(self):
        """Menu CRUD completo para Médicos com exibição de Cidade e Especialidade."""
        while True:
            self.limpar_tela()
            print("\n:: CRUD MÉDICOS ::")
            print("1) Incluir Médico")
            print("2) Consultar Médico")
            print("3) Alterar Médico")
            print("4) Excluir Médico")
            print("5) Listar Médicos Ordenados")
            print("0) Voltar ao Menu Principal")
            opcao = input("Escolha uma opção: ")

            if opcao == '1':
                codigo = self._obter_codigo_medico("incluir")
                nome = input("Digite o nome do Médico: ")
                endereco = input("Digite o endereço do Médico: ")
                telefone = input("Digite o telefone do Médico: ")
                codigo_cidade = self._obter_codigo_cidade("associar")
                codigo_especialidade = self._obter_codigo_especialidade("associar")
                resultado = self.medico_service.incluir(codigo, nome, endereco, telefone, codigo_cidade,
                                                        codigo_especialidade)
                print(resultado["mensagem"])
                input("Pressione Enter para continuar...")

            elif opcao == '2':
                codigo = self._obter_codigo_medico("consultar")
                resultado = self.medico_service.consultar(codigo)
                if resultado["status"] == "SUCESSO":
                    medico = resultado["dados"]
                    cidade = self.cidade_service.consultar(medico["codigo_cidade"]).get("dados")
                    especialidade = self.especialidade_service.consultar(medico["codigo_especialidade"]).get("dados")
                    print(f"\nCód Médico: {medico['codigo_medico']}")
                    print(f"Nome: {medico['nome']}")
                    print(f"Endereço: {medico['endereco']}")
                    print(f"Telefone: {medico['telefone']}")
                    if cidade:
                        print(f"Cidade: {cidade.descricao} / {cidade.estado}")
                    if especialidade:
                        print(f"Especialidade: {especialidade.descricao}")
                        print(f"Valor Consulta: R$ {especialidade.valor_consulta:.2f}")
                        print(f"Limite Diário: {especialidade.limite_diario}")
                else:
                    print(resultado["mensagem"])
                input("Pressione Enter para continuar...")

            elif opcao == '3':
                codigo = self._obter_codigo_medico("alterar")
                nome = input("Digite o novo nome (Enter para manter atual): ")
                endereco = input("Digite o novo endereço (Enter para manter atual): ")
                telefone = input("Digite o novo telefone (Enter para manter atual): ")
                codigo_cidade = input("Digite o novo código da cidade (Enter para manter atual): ")
                codigo_especialidade = input("Digite o novo código da especialidade (Enter para manter atual): ")
                codigo_cidade = int(codigo_cidade) if codigo_cidade.strip() else None
                codigo_especialidade = int(codigo_especialidade) if codigo_especialidade.strip() else None
                resultado = self.medico_service.alterar(codigo, nome or None, endereco or None, telefone or None,
                                                        codigo_cidade, codigo_especialidade)
                print(resultado["mensagem"])
                input("Pressione Enter para continuar...")

            elif opcao == '4':
                codigo = self._obter_codigo_medico("excluir")
                resultado = self.medico_service.excluir(codigo)
                print(resultado["mensagem"])
                input("Pressione Enter para continuar...")

            elif opcao == '5':
                medicos = self.medico_service.listar_ordenado()
                print("\n=== LISTA DE MÉDICOS ORDENADA ===")
                for medico in medicos:
                    cidade = self.cidade_service.consultar(medico.codigo_cidade).get("dados")
                    especialidade = self.especialidade_service.consultar(medico.codigo_especialidade).get("dados")
                    cidade_str = f"{cidade.descricao} / {cidade.estado}" if cidade else f"Cód: {medico.codigo_cidade}"
                    especialidade_str = (f"{especialidade.descricao} - R$ {especialidade.valor_consulta:.2f} "
                                         f"(Limite: {especialidade.limite_diario})") if especialidade else f"Cód: {medico.codigo_especialidade}"
                    print(f"Cód: {medico.codigo_medico} | Nome: {medico.nome} | Endereço: {medico.endereco} | "
                          f"Tel: {medico.telefone} | Cidade: {cidade_str} | Especialidade: {especialidade_str}")
                input("Pressione Enter para continuar...")

            elif opcao == '0':
                break
            else:
                print("Opção inválida.")
                input("Pressione Enter para continuar...")


    def menu_exames_crud(self):
        while True:
            self.limpar_tela()
            print("\n:: CRUD EXAMES ::")
            print("1) Listar todos os exames")
            print("2) Incluir novo exame")
            print("3) Consultar exame")
            print("4) Alterar exame")
            print("5) Excluir exame")
            print("0) Voltar ao menu principal")

            opcao = input("Escolha uma opção: ")

            if opcao == '1':
                exames = self.exame_service.listar_ordenado()
                print("\nCód | Descrição | Especialidade | Valor do Exame | Valor Consulta | Limite Diário")
                print("-" * 80)
                for exame in exames:
                    esp = self.especialidade_service.consultar(exame.codigo_especialidade)
                    if esp.get("dados"):
                        desc_esp = esp["dados"].descricao
                        valor_consulta = esp["dados"].valor_consulta
                        limite_diario = esp["dados"].limite_diario
                    else:
                        desc_esp = "Especialidade não encontrada"
                        valor_consulta = 0
                        limite_diario = 0
                    print(f"{exame.codigo_exame} | {exame.descricao} | {desc_esp} | "
                          f"R$ {exame.valor_exame:.2f} | R$ {valor_consulta:.2f} | {limite_diario}")
                input("\nPressione Enter para continuar...")


            elif opcao == '2':

                try:

                    codigo = int(input("Código do Exame: "))

                    descricao = input("Descrição do Exame: ")



                    codigo_esp = int(input("Código da Especialidade: "))

                    esp = self.especialidade_service.consultar(codigo_esp)

                    if esp.get("dados"):

                        print(f"Especialidade selecionada: {esp['dados'].descricao}, "

                              f"Valor da Consulta: R$ {esp['dados'].valor_consulta:.2f}, "

                              f"Limite Diário: {esp['dados'].limite_diario}")

                    else:

                        print("[ATENÇÃO] Especialidade não encontrada!")

                    valor = float(input("Valor do Exame: "))

                    resultado = self.exame_service.incluir(codigo, descricao, codigo_esp, valor)

                    print(resultado["mensagem"])


                except ValueError:

                    print("[ERRO] Dados inválidos!")

                input("Pressione Enter para continuar...")

            elif opcao == '3':
                try:
                    codigo = int(input("Código do Exame para consulta: "))
                    resultado = self.exame_service.consultar(codigo)
                    if resultado["status"] == "SUCESSO":
                        exame = resultado["dados"]
                        esp = self.especialidade_service.consultar(exame.codigo_especialidade)
                        if esp.get("dados"):
                            desc_esp = esp["dados"].descricao
                            valor_consulta = esp["dados"].valor_consulta
                            limite_diario = esp["dados"].limite_diario
                        else:
                            desc_esp = "Especialidade não encontrada"
                            valor_consulta = 0
                            limite_diario = 0
                        print(f"\nCód: {exame.codigo_exame}\nDescrição: {exame.descricao}\n"
                              f"Especialidade: {desc_esp}\nValor do Exame: R$ {exame.valor_exame:.2f}\n"
                              f"Valor da Consulta: R$ {valor_consulta:.2f}\nLimite Diário: {limite_diario}")
                    else:
                        print(resultado["mensagem"])
                except ValueError:
                    print("[ERRO] Código inválido!")
                input("Pressione Enter para continuar...")

            elif opcao == '4':
                try:
                    codigo = int(input("Código do Exame para alteração: "))
                    descricao = input("Nova descrição (Enter para manter atual): ")
                    codigo_esp = input("Novo código da Especialidade (Enter para manter atual): ")
                    valor = input("Novo valor do Exame (Enter para manter atual): ")

                    codigo_esp = int(codigo_esp) if codigo_esp.strip() != "" else None
                    valor = float(valor) if valor.strip() != "" else None

                    resultado = self.exame_service.alterar(codigo, descricao if descricao != "" else None,
                                                           codigo_esp, valor)
                    print(resultado["mensagem"])
                except ValueError:
                    print("[ERRO] Dados inválidos!")
                input("Pressione Enter para continuar...")

            elif opcao == '5':
                try:
                    codigo = int(input("Código do Exame para exclusão: "))
                    resultado = self.exame_service.excluir(codigo)
                    print(resultado["mensagem"])
                except ValueError:
                    print("[ERRO] Código inválido!")
                input("Pressione Enter para continuar...")

            elif opcao == '0':
                break

            else:
                print("Opção inválida!")
                input("Pressione Enter para continuar...")



    def menu_consultas_crud(self):
        """CRUD completo de Consultas, integrando verificação e consumo de limite diário."""


        def _to_dict_safe(data):
            """Converte o resultado do service (objeto ou dict) para dict de forma segura."""
            if hasattr(data, 'to_dict'):
                return data.to_dict()
            return data

        def exibir_consulta(consulta):



            paciente_res = self.paciente_service.consultar(consulta.codigo_paciente)
            medico_res = self.medico_service.consultar(consulta.codigo_medico)
            exame_res = self.exame_service.consultar(consulta.codigo_exame)

            if paciente_res["status"] == "ERRO" or medico_res["status"] == "ERRO" or exame_res["status"] == "ERRO":
                print(f"Erro ao exibir dados relacionados para Cód Consulta: {consulta.codigo_consulta}")

                print(
                    f"Status Paciente: {paciente_res['status']} | Status Médico: {medico_res['status']} | Status Exame: {exame_res['status']}")
                return

            paciente_dict = paciente_res["dados"]
            medico_data = medico_res["dados"]
            exame_data = exame_res["dados"]


            medico_dict = _to_dict_safe(medico_data)
            exame_dict = _to_dict_safe(exame_data)



            especialidade_obj = self.especialidade_service.consultar(medico_dict["codigo_especialidade"])["dados"]
            especialidade_dict = _to_dict_safe(especialidade_obj)


            cidade_res = self.cidade_service.consultar(paciente_dict["codigo_cidade"])
            cidade_dict = cidade_res["dados"]


            valor_total = especialidade_dict["valor_consulta"] + exame_dict["valor_exame"]

            print(f"\nCód Consulta: {consulta.codigo_consulta}")
            print(f"Paciente: {paciente_dict['nome']} - Cidade: {cidade_dict['descricao']}/{cidade_dict['estado']}")
            print(f"Médico: {medico_dict['nome']}")
            print(f"Exame: {exame_dict['descricao']}")
            print(f"Especialidade: {especialidade_dict['descricao']}")
            print(f"Data/Hora: {consulta.data} às {consulta.hora}")
            print(f"Valor total a pagar: R$ {valor_total:.2f}")

        while True:
            self.limpar_tela()
            print("\n--- MENU CONSULTAS ---")
            print("1 - Incluir Consulta")
            print("2 - Consultar Consulta")
            print("3 - Alterar Consulta")
            print("4 - Excluir Consulta")
            print("5 - Listar Consultas")
            print("0 - Voltar ao menu principal")

            opcao = input("Escolha uma opção: ")

            if opcao == "1":
                codigo = self._obter_codigo_consulta("incluir")
                cod_paciente = self._obter_codigo_paciente("incluir")
                cod_medico = self._obter_codigo_medico("incluir")
                cod_exame = self._obter_codigo_exame("incluir")
                data = input("Data (DD/MM/AAAA): ")
                hora = input("Hora (HH:MM): ")

                medico_info = self.medico_service.consultar(cod_medico)
                if medico_info["status"] == "ERRO":
                    print(medico_info["mensagem"])
                    input("Pressione Enter para continuar...")
                    continue


                cod_especialidade = _to_dict_safe(medico_info["dados"])["codigo_especialidade"]




                resultado = self.consulta_service.incluir(codigo, cod_paciente, cod_medico, cod_exame, data, hora)
                print(resultado["mensagem"])


                if resultado["status"] == "SUCESSO":
                    consulta = self.consulta_service.consultar(codigo)["dados"]
                    exibir_consulta(consulta)

                input("Pressione Enter para continuar...")

            elif opcao == "2":
                codigo = self._obter_codigo_consulta("consultar")
                resultado = self.consulta_service.consultar(codigo)
                if resultado["status"] == "ERRO":
                    print(resultado["mensagem"])
                else:
                    exibir_consulta(resultado["dados"])
                input("Pressione Enter para continuar...")

            elif opcao == "3":
                codigo = self._obter_codigo_consulta("alterar")
                cod_paciente = input("Novo Código do Paciente (Enter para manter): ")
                cod_medico = input("Novo Código do Médico (Enter para manter): ")
                cod_exame = input("Novo Código do Exame (Enter para manter): ")
                data = input("Nova Data DD/MM/AAAA (Enter para manter): ")
                hora = input("Nova Hora HH:MM (Enter para manter): ")

                resultado = self.consulta_service.alterar(
                    codigo,
                    int(cod_paciente) if cod_paciente.strip() else None,
                    int(cod_medico) if cod_medico.strip() else None,
                    int(cod_exame) if cod_exame.strip() else None,
                    data if data.strip() else None,
                    hora if hora.strip() else None
                )
                print(resultado["mensagem"])
                input("Pressione Enter para continuar...")

            elif opcao == "4":
                codigo = self._obter_codigo_consulta("excluir")


                resultado = self.consulta_service.excluir(codigo)
                print(resultado["mensagem"])

                input("Pressione Enter para continuar...")

            elif opcao == "5":
                consultas = self.consulta_service.listar_ordenado()
                if not consultas:
                    print("Nenhuma consulta cadastrada.")
                else:
                    for c in consultas:
                        exibir_consulta(c)
                input("Pressione Enter para continuar...")

            elif opcao == "0":
                break

            else:
                print("Opção inválida. Tente novamente.")
                input("Pressione Enter para continuar...")

    def menu_faturamento(self):
        while True:
            self.limpar_tela()
            print("\n--- MENU FATURAMENTO ---")
            print("1 - Faturamento por dia")
            print("2 - Faturamento por período")
            print("3 - Faturamento por médico")
            print("4 - Faturamento por especialidade")
            print("0 - Voltar ao menu principal")

            opcao = input("Escolha uma opção: ")

            if opcao == "1":
                data = input("Data (DD/MM/AAAA): ")
                total = self.faturamento_service.faturamento_por_dia(data)
                print(f"Faturamento no dia {data}: R$ {total:.2f}")

            elif opcao == "2":
                inicio = input("Data inicial (DD/MM/AAAA): ")
                fim = input("Data final (DD/MM/AAAA): ")
                total = self.faturamento_service.faturamento_por_periodo(inicio, fim)
                print(f"Faturamento entre {inicio} e {fim}: R$ {total:.2f}")

            elif opcao == "3":
                cod_medico = self._obter_codigo_medico("consultar faturamento")
                total = self.faturamento_service.faturamento_por_medico(cod_medico)
                print(f"Faturamento do médico {cod_medico}: R$ {total:.2f}")

            elif opcao == "4":
                cod_esp = self._obter_codigo_especialidade("consultar faturamento")
                total = self.faturamento_service.faturamento_por_especialidade(cod_esp)
                print(f"Faturamento da especialidade {cod_esp}: R$ {total:.2f}")

            elif opcao == "0":
                break
            else:
                print("Opção inválida.")

            input("Pressione Enter para continuar...")

    def handle_consulta_inclusao(self):
        print("\n:: INCLUSÃO DE CONSULTA/AGENDAMENTO ::")

        codigo = self._obter_codigo_consulta("incluir")
        data = input("Data (DD/MM/AAAA): ")
        hora = input("Hora (HH:MM): ")




        while True:
            try:
                codigo_paciente = int(input("Cód. do Paciente: "))
                if not self.paciente_service.consultar(codigo_paciente).get("dados"):
                    print(f"[AVISO] Paciente com código {codigo_paciente} não existe.")
                    conf = input("Deseja tentar novamente (S/N)? ").upper()
                    if conf != 'S': return
                else:
                    break
            except ValueError:
                print("[ERRO] Código do Paciente inválido, deve ser número inteiro.")


        while True:
            try:
                codigo_medico = int(input("Cód. do Médico: "))
                medico_res = self.medico_service.consultar(codigo_medico)
                if not medico_res.get("dados"):
                    print(f"[AVISO] Médico com código {codigo_medico} não existe.")
                    conf = input("Deseja tentar novamente (S/N)? ").upper()
                    if conf != 'S': return
                else:
                    break
            except ValueError:
                print("[ERRO] Código do Médico inválido, deve ser número inteiro.")


        while True:
            try:
                codigo_exame = int(input("Cód. do Exame: "))
                if not self.exame_service.consultar(codigo_exame).get("dados"):
                    print(f"[AVISO] Exame com código {codigo_exame} não existe.")
                    conf = input("Deseja tentar novamente (S/N)? ").upper()
                    if conf != 'S': return
                else:
                    break
            except ValueError:
                print("[ERRO] Código do Exame inválido, deve ser número inteiro.")


        resultado = self.consulta_service.incluir(
            codigo, codigo_paciente, codigo_medico, codigo_exame, data, hora
        )
        print(f"[{resultado['status']}] {resultado['mensagem']}")
        input("Enter para continuar...")

    def handle_consulta_consulta(self):
        codigo = self._obter_codigo_consulta("consultar")
        resultado = self.consulta_service.consultar(codigo)
        if resultado["status"] == "SUCESSO":
            dados = resultado["dados"]
            print("-" * 70)
            print(f"Cód Consulta: {dados.codigo_consulta}")
            print(f"Data/Hora: {dados.data} às {dados.hora}")
            print(
                f"Paciente Cód: {dados.codigo_paciente} | Médico Cód: {dados.codigo_medico} | Exame Cód: {dados.codigo_exame}")
            print("-" * 70)
        else:
            print(resultado["mensagem"])
        input("Enter para continuar...")

    def handle_consulta_exclusao(self):
        codigo = self._obter_codigo_consulta("excluir")
        busca = self.consulta_service.consultar(codigo)
        if busca["status"] == "ERRO":
            print(busca["mensagem"])
            input("Enter para continuar...")
            return

        confirmar = input(f"Confirmar exclusão da consulta Cód '{codigo}' (S/N)? ").upper()
        if confirmar == 'S':

            resultado = self.consulta_service.excluir(codigo)
            print(f"[{resultado['status']}] {resultado['mensagem']}")
        else:
            print("Operação cancelada.")
        input("Enter para continuar...")



    def menu_diarias_crud(self):
        from app.services.DiariaService import DiariaService
        from app.services.EspecialidadeService import EspecialidadeService

        diaria_service = DiariaService()
        especialidade_service = EspecialidadeService()

        while True:
            print("\n--- MENU DIÁRIAS CRUD ---")
            print("1 - Incluir Diária")
            print("2 - Consultar Diária")
            print("3 - Alterar Diária")
            print("4 - Excluir Diária")
            print("5 - Listar Todas as Diárias")
            print("0 - Voltar")
            opcao = input("Escolha uma opção: ")

            if opcao == "1":
                codigo_dia = input("Código do Dia (AAAAMMDD): ")
                codigo_especialidade = int(input("Código da Especialidade: "))


                esp = especialidade_service.consultar(codigo_especialidade)
                if esp["status"] == "SUCESSO":
                    print(f"Especialidade: {esp['dados'].descricao}, Limite Diário: {esp['dados'].limite_diario}")
                else:
                    print(esp["mensagem"])
                    continue

                quantidade = int(input("Quantidade de Consultas: "))
                resultado = diaria_service.incluir(codigo_dia, codigo_especialidade, quantidade)
                print(resultado["mensagem"])

            elif opcao == "2":
                codigo_dia = input("Código do Dia (AAAAMMDD): ")
                codigo_especialidade = int(input("Código da Especialidade: "))
                resultado = diaria_service.consultar(codigo_dia, codigo_especialidade)
                diaria = resultado["dados"]


                esp = especialidade_service.consultar(codigo_especialidade)
                nome_esp = esp["dados"].descricao if esp["status"] == "SUCESSO" else "N/D"

                print(
                    f"Cód Dia: {diaria.codigo_dia}, Especialidade: {nome_esp}, Qtd Consultas: {diaria.quantidade_consultas}")

            elif opcao == "3":
                codigo_dia = input("Código do Dia (AAAAMMDD): ")
                codigo_especialidade = int(input("Código da Especialidade: "))
                nova_quantidade = int(input("Nova Quantidade de Consultas: "))
                resultado = diaria_service.alterar(codigo_dia, codigo_especialidade, nova_quantidade)
                print(resultado["mensagem"])

            elif opcao == "4":
                codigo_dia = input("Código do Dia (AAAAMMDD): ")
                codigo_especialidade = int(input("Código da Especialidade: "))
                resultado = diaria_service.excluir(codigo_dia, codigo_especialidade)
                print(resultado["mensagem"])

            elif opcao == "5":
                diarias = diaria_service.listar_ordenado()
                print("\n--- LISTA DE DIÁRIAS ---")
                for d in diarias:
                    esp = especialidade_service.consultar(d.codigo_especialidade)
                    nome_esp = esp["dados"].descricao if esp["status"] == "SUCESSO" else "N/D"
                    print(
                        f"Cód Dia: {d.codigo_dia}, Especialidade: {nome_esp}, Qtd Consultas: {d.quantidade_consultas}")

            elif opcao == "0":
                break
            else:
                print("Opção inválida. Tente novamente.")

    def _obter_chave_diaria(self):
        """Função auxiliar para obter os dois componentes da chave composta."""
        while True:
            try:
                print("\nPara a Diária, a chave é composta por:")
                codigo_dia = int(input("  Cód. do Dia (AAAAMMDD): "))
                codigo_especialidade = int(input("  Cód. da Especialidade: "))
                return codigo_dia, codigo_especialidade
            except ValueError:
                print("[ERRO] Códigos inválidos, devem ser números inteiros.")

    def handle_diaria_inclusao(self):
        print("\n:: INCLUSÃO/AJUSTE MANUAL DE DIÁRIA ::")
        codigo_dia, codigo_especialidade = self._obter_chave_diaria()

        while True:
            try:
                quantidade = int(input("Quantidade Inicial de Consultas: "))
                break
            except ValueError:
                print("[ERRO] Quantidade deve ser um número inteiro.")

        resultado = self.diaria_service.incluir(
            codigo_dia, codigo_especialidade, quantidade
        )
        print(f"[{resultado['status']}] {resultado['mensagem']}")
        input("Enter para continuar...")

    def handle_diaria_consulta(self):
        codigo_dia, codigo_especialidade = self._obter_chave_diaria()

        resultado = self.diaria_service.consultar(codigo_dia, codigo_especialidade)
        dados = resultado["dados"]

        print("-" * 60)
        print(f"Diária (Chave Composta): {dados.chave_composta}")
        print(f"Cód. Dia: {dados.codigo_dia} | Cód. Especialidade: {dados.codigo_especialidade}")
        print(f"Quantidade de Consultas: {dados.quantidade_consultas}")
        print("-" * 60)

        if dados.quantidade_consultas == 0 and resultado["status"] == "SUCESSO":
            print("[AVISO] O registro de diária não foi encontrado, a contagem é 0.")

        input("Enter para continuar...")

    def handle_diaria_alteracao(self):
        print("\n:: ALTERAÇÃO DA QUANTIDADE DE CONSULTAS EM DIÁRIA ::")
        codigo_dia, codigo_especialidade = self._obter_chave_diaria()

        chave = self.diaria_service._gerar_chave_composta(codigo_dia, codigo_especialidade)
        diaria_existente = self.diaria_service.repo.buscar_por_chave(chave)

        if diaria_existente is None:
            print(f"Diária para a chave {chave} não existe. Use Inclusão.")
            input("Enter para continuar...")
            return

        dados_atuais = diaria_existente
        print(f"\nAlterando Diária: {dados_atuais.chave_composta}")
        print(f"Quantidade atual: {dados_atuais.quantidade_consultas}")

        while True:
            try:
                nova_quantidade = int(input("Nova Quantidade de Consultas: "))
                if nova_quantidade < 0:
                    print("[ERRO] A quantidade deve ser um número inteiro não negativo.")
                    continue
                break
            except ValueError:
                print("[ERRO] Quantidade inválida, deve ser número inteiro.")

        resultado = self.diaria_service.alterar(
            codigo_dia, codigo_especialidade, nova_quantidade
        )

        print(f"[{resultado['status']}] {resultado['mensagem']}")
        input("Enter para continuar...")

    def handle_diaria_exclusao(self):
        print("\n:: EXCLUSÃO DE REGISTRO DE DIÁRIA ::")
        codigo_dia, codigo_especialidade = self._obter_chave_diaria()

        chave = self.diaria_service._gerar_chave_composta(codigo_dia, codigo_especialidade)
        diaria_existente = self.diaria_service.repo.buscar_por_chave(chave)

        if diaria_existente is None:
            print(f"Diária para a chave {chave} não existe.")
            input("Enter para continuar...")
            return

        confirmar = input(f"Confirmar exclusão da diária '{chave}' (S/N)? ").upper()
        if confirmar == 'S':
            resultado = self.diaria_service.excluir(codigo_dia, codigo_especialidade)
            print(f"[{resultado['status']}] {resultado['mensagem']}")
        else:
            print("Operação cancelada.")
        input("Enter para continuar...")

    def handle_diaria_leitura_exaustiva(self):
        diarias = self.diaria_service.listar_ordenado()
        if not diarias:
            print("Nenhuma diária cadastrada.")
        else:
            print("=" * 80)
            print(
                f"| {'CHAVE COMPOSTA':<20} | {'CÓD. DIA (AAAAMMDD)':<25} | {'CÓD. ESP.':<10} | {'QTD CONSULTAS':<15} |")
            print("=" * 80)
            for d in diarias:
                print(
                    f"| {d.chave_composta:<20} | {d.codigo_dia:<25} | {d.codigo_especialidade:<10} | {d.quantidade_consultas:<15} |")
            print("=" * 80)
        input("Enter para continuar...")


if __name__ == "__main__":
    app = App()
    app.run()