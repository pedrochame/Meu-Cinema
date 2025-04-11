# Importanto bibliotecas necessárias
import os
import requests
from flask import Flask, request,jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from dotenv import load_dotenv
from flask_cors import CORS
from controller import usuarioController

# Definindo aplicação Flask
app = Flask(__name__)

# Ativando CORS
CORS(app,supports_credentials=True)

# Carregando variáveis de ambiente (arquivo .env)
load_dotenv()

# Configurando chave secreta da aplicação
app.secret_key = os.getenv("CHAVE_FLASK")

# Configurando o gerenciador de login da aplicação
login_manager = LoginManager(app)

# Controllers
usuarioController = usuarioController()

# Classe de Usuário (para sessão)
class Usuario(UserMixin):
    def __init__(self, id):
        self.id = id

# Função para carregar usuário da sessão
@login_manager.user_loader
def load_user(usuario_id):
    if usuarioController.verificaUsuario(usuario_id):
        return Usuario(usuario_id)
    else:
        return None

# Rota para cadastrar o usuário
@app.route("/cadastro",methods=["POST"])
def cadastro():

    nome , senha = request.json["nome"] , request.json["senha"]

    if usuarioController.criaUsuario(nome,senha):
        return jsonify({"Mensagem":"Usuário cadastrado."}),201
    else:
        return jsonify({"Mensagem":"Falha ao cadastrar usuário."}),400

# Rota para logar o usuário
@app.route("/login",methods=["POST"])
def login():
    
    nome  = request.json["nome"]
    senha = request.json["senha"]

    usuario_id = usuarioController.buscaUsuario(nome,senha)
    usuario = Usuario(usuario_id)

    if usuario_id != -1:
        login_user(usuario)
        return jsonify({"Mensagem": "Usuário logado."}),200
    else:
        return jsonify({"Mensagem": "Usuário não existe."}),400

# Rota para deslogar o usuário
@app.route("/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    return jsonify({"Mensagem": "Usuário deslogado."}),200

# Rota para retornar os dados do usuário
@app.route("/usuario", methods=["GET"])
@login_required
def usuario():
    nome = usuarioController.retornaUsuarioNome(current_user.id)
    return jsonify({"ID": current_user.id,"Nome": nome}),200

# Rota para retornar filmes mais bem avaliados (requisitando API TMDB)
@app.route("/filmes",methods=["GET"])
@login_required
def filmes():
    url = "https://api.themoviedb.org/3/movie/top_rated"
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
        "page": 1
    }

    resposta = requests.get(url, params=params)
    return resposta.json()

# Rota para retornar programas de tv mais bem avaliados (requisitando API TMDB)
@app.route("/series",methods=["GET"])
@login_required
def series():
    url = "https://api.themoviedb.org/3/tv/top_rated"
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
        "page": 1
    }

    resposta = requests.get(url, params=params)
    return resposta.json()

# Rota para retornar filmes buscados (requisitando API TMDB)
@app.route("/filmes_busca",methods=["GET"])
@login_required
def filmes_busca():

    url = "https://api.themoviedb.org/3/search/movie"
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
        "page": 1,
        "query": request.args.get("termoBusca"),
    }

    resposta = requests.get(url, params=params)
    return resposta.json()

# Rota para retornar programas de tv buscados (requisitando API TMDB)
@app.route("/series_busca",methods=["GET"])
@login_required
def series_busca():

    url = "https://api.themoviedb.org/3/search/tv"
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
        "page": 1,
        "query": request.args.get("termoBusca"),
    }

    resposta = requests.get(url, params=params)
    return resposta.json()

# Rota para retornar um filme específico (requisitando API TMDB)
@app.route("/filmes/<int:id>",methods=["GET"])
@login_required
def getFilme(id):

    url = "https://api.themoviedb.org/3/movie/"+str(id)
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
    }

    resposta = requests.get(url, params=params)
    return resposta.json()

# Rota para retornar um programa de tv específico (requisitando API TMDB)
@app.route("/series/<int:id>",methods=["GET"])
@login_required
def getSerie(id):

    url = "https://api.themoviedb.org/3/tv/"+str(id)
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
    }

    resposta = requests.get(url, params=params)
    return resposta.json()

# Personalizando resposta para usuário não autorizado
@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"Mensagem": "Usuário não autenticado."}), 401

# Executando aplicação
if __name__ == "__main__":
    app.run(debug=True)