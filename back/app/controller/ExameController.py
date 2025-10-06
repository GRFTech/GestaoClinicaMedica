from flask import Blueprint, request, jsonify
from app.services.ExameService import ExameService

exame_service = ExameService()
exame_bp = Blueprint('exame_bp', __name__, url_prefix='/api')

# ------------------ CRUD ------------------

@exame_bp.route('/exames', methods=['POST'])
def incluir_exame():
    data = request.json
    codigo = data.get('codigo_exame')
    descricao = data.get('descricao')
    codigo_especialidade = data.get('codigo_especialidade')
    valor_exame = data.get('valor_exame')

    resultado = exame_service.incluir(codigo, descricao, codigo_especialidade, valor_exame)
    return jsonify(resultado)

@exame_bp.route('/exames/<int:codigo>', methods=['GET'])
def consultar_exame(codigo):
    resultado = exame_service.consultar(codigo)
    if resultado["status"] == "SUCESSO":
        exame = resultado["dados"]
        resultado["dados"] = {
            "codigo_exame": exame.codigo_exame,
            "descricao": exame.descricao,
            "codigo_especialidade": exame.codigo_especialidade,
            "valor_exame": exame.valor_exame
        }
    return jsonify(resultado)

@exame_bp.route('/exames/<int:codigo>', methods=['PUT'])
def alterar_exame(codigo):
    data = request.json
    descricao = data.get('descricao')
    codigo_especialidade = data.get('codigo_especialidade')
    valor_exame = data.get('valor_exame')

    resultado = exame_service.alterar(codigo, descricao, codigo_especialidade, valor_exame)
    return jsonify(resultado)

@exame_bp.route('/exames/<int:codigo>', methods=['DELETE'])
def excluir_exame(codigo):
    resultado = exame_service.excluir(codigo)
    return jsonify(resultado)

@exame_bp.route('/exames', methods=['GET'])
def listar_exames():
    exames = exame_service.listar_ordenado()
    exames_dict = [
        {
            "codigo_exame": e.codigo_exame,
            "descricao": e.descricao,
            "codigo_especialidade": e.codigo_especialidade,
            "valor_exame": e.valor_exame
        }
        for e in exames
    ]
    return jsonify({"status": "SUCESSO", "dados": exames_dict})
