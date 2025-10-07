from flask import Blueprint, request, jsonify
from app.services.MedicoService import MedicoService

medico_service = MedicoService()
medico_bp = Blueprint('medico_bp', __name__, url_prefix='/api')



@medico_bp.route('/medicos', methods=['POST'])
def incluir_medico():
    data = request.json
    codigo = medico_service.gerar_proximo_codigo()
    nome = data.get('nome')
    endereco = data.get('endereco')
    telefone = data.get('telefone')
    codigo_cidade = data.get('codigo_cidade')
    codigo_especialidade = data.get('codigo_especialidade')

    resultado = medico_service.incluir(codigo, nome, endereco, telefone, codigo_cidade, codigo_especialidade)
    return jsonify(resultado)


@medico_bp.route('/medicos/<int:codigo>', methods=['GET'])
def consultar_medico(codigo):
    resultado = medico_service.consultar(codigo)
    return jsonify(resultado)


@medico_bp.route('/medicos/<int:codigo>', methods=['PUT'])
def alterar_medico(codigo):
    data = request.json
    nome = data.get('nome')
    endereco = data.get('endereco')
    telefone = data.get('telefone')
    codigo_cidade = data.get('codigo_cidade')
    codigo_especialidade = data.get('codigo_especialidade')

    resultado = medico_service.alterar(codigo, nome, endereco, telefone, codigo_cidade, codigo_especialidade)
    return jsonify(resultado)


@medico_bp.route('/medicos/<int:codigo>', methods=['DELETE'])
def excluir_medico(codigo):
    resultado = medico_service.excluir(codigo)
    return jsonify(resultado)


@medico_bp.route('/medicos', methods=['GET'])
def listar_medicos():
    medicos = medico_service.listar_ordenado()
    medicos_dict = [
        {
            "codigo_medico": m.codigo_medico,
            "nome": m.nome,
            "endereco": m.endereco,
            "telefone": m.telefone,
            "codigo_cidade": m.codigo_cidade,
            "codigo_especialidade": m.codigo_especialidade
        }
        for m in medicos
    ]
    return jsonify({"status": "SUCESSO", "dados": medicos_dict})
