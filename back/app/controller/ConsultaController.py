from flask import Blueprint, request, jsonify
from app.services.ConsultaService import ConsultaService

consulta_service = ConsultaService()
consulta_bp = Blueprint('consulta_bp', __name__, url_prefix='/api')

# ------------------ CRUD ------------------

@consulta_bp.route('/consultas', methods=['POST'])
def incluir_consulta():
    data = request.json
    codigo = data.get('codigo_consulta')
    codigo_paciente = data.get('codigo_paciente')
    codigo_medico = data.get('codigo_medico')
    codigo_exame = data.get('codigo_exame')
    data_consulta = data.get('data')
    hora = data.get('hora')

    resultado = consulta_service.incluir(
        codigo, codigo_paciente, codigo_medico, codigo_exame, data_consulta, hora
    )
    return jsonify(resultado)


@consulta_bp.route('/consultas/<int:codigo>', methods=['GET'])
def consultar_consulta(codigo):
    resultado = consulta_service.consultar(codigo)
    if resultado["status"] == "SUCESSO":
        consulta = resultado["dados"]
        resultado["dados"] = consulta.to_dict()  # <-- converte para dict
    return jsonify(resultado)


@consulta_bp.route('/consultas/<int:codigo>', methods=['PUT'])
def alterar_consulta(codigo):
    data = request.json
    codigo_paciente = data.get('codigo_paciente')
    codigo_medico = data.get('codigo_medico')
    codigo_exame = data.get('codigo_exame')
    data_consulta = data.get('data')
    hora = data.get('hora')

    resultado = consulta_service.alterar(
        codigo, codigo_paciente, codigo_medico, codigo_exame, data_consulta, hora
    )
    return jsonify(resultado)


@consulta_bp.route('/consultas/<int:codigo>', methods=['DELETE'])
def excluir_consulta(codigo):
    resultado = consulta_service.excluir(codigo)
    return jsonify(resultado)


@consulta_bp.route('/consultas', methods=['GET'])
def listar_consultas():
    consultas = consulta_service.listar_ordenado()
    consultas_dict = [c.to_dict() for c in consultas]  # <-- converte cada objeto
    return jsonify({"status": "SUCESSO", "dados": consultas_dict})
