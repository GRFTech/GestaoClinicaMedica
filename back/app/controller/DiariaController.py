from flask import Blueprint, request, jsonify
from app.services.DiariaService import DiariaService

diaria_service = DiariaService()
diaria_bp = Blueprint('diaria_bp', __name__, url_prefix='/api')



@diaria_bp.route('/diarias', methods=['POST'])
def incluir_diaria():
    data = request.json
    codigo_dia = data.get('codigo_dia')
    codigo_especialidade = data.get('codigo_especialidade')
    quantidade = data.get('quantidade_consultas', 0)

    resultado = diaria_service.incluir(codigo_dia, codigo_especialidade, quantidade)
    return jsonify(resultado)

@diaria_bp.route('/diarias/<int:codigo_dia>/<int:codigo_especialidade>', methods=['GET'])
def consultar_diaria(codigo_dia, codigo_especialidade):
    resultado = diaria_service.consultar(codigo_dia, codigo_especialidade)
    if resultado["status"] == "SUCESSO":
        diaria = resultado["dados"]
        resultado["dados"] = diaria.to_dict()
    return jsonify(resultado)

@diaria_bp.route('/diarias/<int:codigo_dia>/<int:codigo_especialidade>', methods=['PUT'])
def alterar_diaria(codigo_dia, codigo_especialidade):
    data = request.json
    nova_quantidade = data.get('quantidade_consultas')
    resultado = diaria_service.alterar(codigo_dia, codigo_especialidade, nova_quantidade)
    return jsonify(resultado)

@diaria_bp.route('/diarias/<int:codigo_dia>/<int:codigo_especialidade>', methods=['DELETE'])
def excluir_diaria(codigo_dia, codigo_especialidade):
    resultado = diaria_service.excluir(codigo_dia, codigo_especialidade)
    return jsonify(resultado)


@diaria_bp.route('/diarias', methods=['GET'])
def listar_diarias():
    diarias = diaria_service.listar_ordenado()
    diarias_dict = [d.to_dict() for d in diarias]

    response = jsonify({"status": "SUCESSO", "dados": diarias_dict})


    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'

    return response
