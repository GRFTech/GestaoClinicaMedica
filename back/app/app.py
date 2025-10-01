from flask import Flask
import json

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':

    # Objeto Python (Dicionário ou Lista) que você quer salvar
    dados_a_salvar = {
        "nome": "Carla",
        "idade": 32,
        "habilidades": ["Python", "JSON", "APIs"],
        "empregado": True
    }

    # Nome do arquivo de destino
    nome_arquivo = 'dados.json'

    # 'w' abre o arquivo em modo de escrita
    # 'indent=4' é opcional e serve para formatar o JSON de forma legível
    try:
        with open(nome_arquivo, 'w', encoding='utf-8') as arquivo:
            json.dump(dados_a_salvar, arquivo, indent=4)
        print(f"Dados salvos com sucesso em {nome_arquivo}")
    except Exception as e:
        print(f"Erro ao salvar o arquivo: {e}")


    app.run()