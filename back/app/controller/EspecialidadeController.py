from flask import Blueprint, request, jsonify
from app.services.EspecialidadeService import EspecialidadeService

especialidade_service = EspecialidadeService()
especialidade_bp = Blueprint('especialidade_bp', __name__, url_prefix='/api')



@especialidade_bp.route('/especialidades', methods=['POST'])
def incluir_especialidade():
    data = request.json
    codigo = especialidade_service.gerar_proximo_codigo()
    descricao = data.get('descricao')
    valor_consulta = data.get('valor_consulta')
    limite_diario = data.get('limite_diario')

    resultado = especialidade_service.incluir(codigo, descricao, valor_consulta, limite_diario)
    return jsonify(resultado)

@especialidade_bp.route('/especialidades/<int:codigo>', methods=['GET'])
def consultar_especialidade(codigo):
    resultado = especialidade_service.consultar(codigo)
    if resultado["status"] == "SUCESSO":
        resultado["dados"] = resultado["dados"].to_dict()
    return jsonify(resultado)

@especialidade_bp.route('/especialidades/<int:codigo>', methods=['PUT'])
def alterar_especialidade(codigo):
    data = request.json
    descricao = data.get('descricao')
    valor_consulta = data.get('valor_consulta')
    limite_diario = data.get('limite_diario')

    resultado = especialidade_service.alterar(codigo, descricao, valor_consulta, limite_diario)
    return jsonify(resultado)

@especialidade_bp.route('/especialidades/<int:codigo>', methods=['DELETE'])
def excluir_especialidade(codigo):
    resultado = especialidade_service.excluir(codigo)
    return jsonify(resultado)

@especialidade_bp.route('/especialidades', methods=['GET'])
def listar_especialidades():
    especialidades = especialidade_service.listar_ordenado()
    especialidades_dict = [e.to_dict() for e in especialidades]
    return jsonify({"status": "SUCESSO", "dados": especialidades_dict})
