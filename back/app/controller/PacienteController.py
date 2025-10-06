from flask import Blueprint, request, jsonify
from app.services.PacienteService import PacienteService

paciente_service = PacienteService()
paciente_bp = Blueprint('paciente_bp', __name__, url_prefix='/api')

# ------------------ CRUD ------------------

@paciente_bp.route('/pacientes', methods=['POST'])
def incluir_paciente():
    data = request.json
    codigo = data.get('codigo_paciente')
    nome = data.get('nome')
    data_nascimento = data.get('data_nascimento')
    endereco = data.get('endereco')
    telefone = data.get('telefone')
    codigo_cidade = data.get('codigo_cidade')
    peso = data.get('peso')
    altura = data.get('altura')

    resultado = paciente_service.incluir(
        codigo, nome, data_nascimento, endereco,
        telefone, codigo_cidade, peso, altura
    )
    return jsonify(resultado)


@paciente_bp.route('/pacientes/<int:codigo>', methods=['GET'])
def consultar_paciente(codigo):
    resultado = paciente_service.consultar(codigo)
    return jsonify(resultado)


@paciente_bp.route('/pacientes/<int:codigo>', methods=['PUT'])
def alterar_paciente(codigo):
    data = request.json
    nome = data.get('nome')
    data_nascimento = data.get('data_nascimento')
    endereco = data.get('endereco')
    telefone = data.get('telefone')
    codigo_cidade = data.get('codigo_cidade')
    peso = data.get('peso')
    altura = data.get('altura')

    resultado = paciente_service.alterar(
        codigo, nome, data_nascimento, endereco,
        telefone, codigo_cidade, peso, altura
    )
    return jsonify(resultado)


@paciente_bp.route('/pacientes/<int:codigo>', methods=['DELETE'])
def excluir_paciente(codigo):
    resultado = paciente_service.excluir(codigo)
    return jsonify(resultado)


@paciente_bp.route('/pacientes', methods=['GET'])
def listar_pacientes():
    pacientes = paciente_service.listar_ordenado()
    pacientes_dict = [
        {
            "codigo_paciente": p.codigo_paciente,
            "nome": p.nome,
            "data_nascimento": p.data_nascimento,
            "endereco": p.endereco,
            "telefone": p.telefone,
            "codigo_cidade": p.codigo_cidade,
            "peso": p.peso,
            "altura": p.altura
        }
        for p in pacientes
    ]
    return jsonify({"status": "SUCESSO", "dados": pacientes_dict})
