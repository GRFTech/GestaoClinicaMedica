from flask import Blueprint, request, jsonify
from app.services.FaturamentoService import FaturamentoService
from app.services.ConsultaService import ConsultaService
from app.services.MedicoService import MedicoService
from app.services.EspecialidadeService import EspecialidadeService
from app.services.ExameService import ExameService
from datetime import datetime


consulta_service = ConsultaService()
medico_service = MedicoService()
especialidade_service = EspecialidadeService()
exame_service = ExameService()

faturamento_service = FaturamentoService(
    consulta_service,
    medico_service,
    especialidade_service,
    exame_service
)

faturamento_bp = Blueprint('faturamento_bp', __name__, url_prefix='/api')



@faturamento_bp.route('/faturamento/dia', methods=['GET'])
def faturamento_por_dia():
    data_str = request.args.get("data")
    if not data_str:
        return jsonify({"status": "ERRO", "mensagem": "Parâmetro 'data' é obrigatório"}), 400


    try:
        datetime.strptime(data_str, "%d/%m/%Y")
    except ValueError:
        return jsonify({"status": "ERRO", "mensagem": "Formato de data inválido. Use DD/MM/YYYY"}), 400

    total = faturamento_service.faturamento_por_dia(data_str)
    return jsonify({
        "status": "SUCESSO",
        "dados": {"data": data_str, "faturamento": total}
    })


@faturamento_bp.route('/faturamento/periodo', methods=['GET'])
def faturamento_por_periodo():
    inicio_str = request.args.get("inicio")
    fim_str = request.args.get("fim")
    if not inicio_str or not fim_str:
        return jsonify({"status": "ERRO", "mensagem": "Parâmetros 'inicio' e 'fim' são obrigatórios"}), 400


    try:
        datetime.strptime(inicio_str, "%d/%m/%Y")
        datetime.strptime(fim_str, "%d/%m/%Y")
    except ValueError:
        return jsonify({"status": "ERRO", "mensagem": "Formato de data inválido. Use DD/MM/YYYY"}), 400

    total = faturamento_service.faturamento_por_periodo(inicio_str, fim_str)
    return jsonify({
        "status": "SUCESSO",
        "dados": {"inicio": inicio_str, "fim": fim_str, "faturamento": total}
    })


@faturamento_bp.route('/faturamento/medico/<int:codigo_medico>', methods=['GET'])
def faturamento_por_medico(codigo_medico):
    total = faturamento_service.faturamento_por_medico(codigo_medico)
    return jsonify({
        "status": "SUCESSO",
        "dados": {"codigo_medico": codigo_medico, "faturamento": total}
    })


@faturamento_bp.route('/faturamento/especialidade/<int:codigo_especialidade>', methods=['GET'])
def faturamento_por_especialidade(codigo_especialidade):
    total = faturamento_service.faturamento_por_especialidade(codigo_especialidade)
    return jsonify({
        "status": "SUCESSO",
        "dados": {"codigo_especialidade": codigo_especialidade, "faturamento": total}
    })
