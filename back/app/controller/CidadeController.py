from flask import Blueprint, request, jsonify
from app.services.CidadeService import CidadeService

cidade_service = CidadeService()
cidade_bp = Blueprint('cidade_bp', __name__, url_prefix='/api')


@cidade_bp.route('/cidades', methods=['POST'])
def incluir_cidade():
    data = request.json
    codigo = cidade_service.obter_ultimo_codigo() + 1
    descricao = data.get('descricao')
    estado = data.get('estado')
    resultado = cidade_service.incluir(codigo, descricao, estado)
    return jsonify(resultado)


@cidade_bp.route('/cidades/<int:codigo>', methods=['GET'])
def consultar_cidade(codigo):
    resultado = cidade_service.consultar(codigo)
    return jsonify(resultado)


@cidade_bp.route('/cidades/<int:codigo>', methods=['PUT'])
def alterar_cidade(codigo):
    data = request.json
    nova_descricao = data.get('descricao')
    novo_estado = data.get('estado')
    resultado = cidade_service.alterar(codigo, nova_descricao, novo_estado)
    return jsonify(resultado)


@cidade_bp.route('/cidades/<int:codigo>', methods=['DELETE'])
def excluir_cidade(codigo):
    resultado = cidade_service.excluir(codigo)
    return jsonify(resultado)


@cidade_bp.route('/cidades', methods=['GET'])
def listar_cidades():
    cidades = cidade_service.listar_ordenado()

    cidades_dict = [cidade.to_dict() for cidade in cidades]
    return jsonify({"status": "SUCESSO", "dados": cidades_dict})
