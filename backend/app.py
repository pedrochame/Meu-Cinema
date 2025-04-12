# Importanto bibliotecas necessárias
import os
import requests
from flask import Flask, request,jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from dotenv import load_dotenv
from flask_cors import CORS
from controller import usuarioController,favoritoController

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
favoritoController = favoritoController()

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
@app.route("/filmes/<string:id>",methods=["GET"])
@login_required
def getFilme(id):

    url = "https://api.themoviedb.org/3/movie/"+id
    
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
    }

    resposta = requests.get(url, params=params)

    # Se a resposta da API TMDB for que o id é invalido (status_code = 34), retornamos o status 404
    try:
        if resposta.json()["status_code"] == 34:
            status = 404
    except:
        status = 200
    
    return resposta.json(),status

# Rota para retornar um programa de tv específico (requisitando API TMDB)
@app.route("/series/<string:id>",methods=["GET"])
@login_required
def getSerie(id):

    url = "https://api.themoviedb.org/3/tv/"+id
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
    }

    resposta = requests.get(url, params=params)

    # Se a resposta da API TMDB for que o id é invalido (status_code = 34), retornamos o status 404
    try:
        if resposta.json()["status_code"] == 34:
            status = 404
    except:
        status = 200
    
    return resposta.json(),status

# Rota para registrar um filme/série como favorito do usuário
@app.route("/favoritos",methods=["POST"])
@login_required
def criarFavorito():

    if set(["filme_id","tipo"]) != set(request.json.keys()): 
        return jsonify({"Mensagem":"Os campos devem ser somente filme_id e tipo."}),400

    idFilme , tipo  = request.json["filme_id"] , request.json["tipo"]

    if idFilme == "" or tipo not in ["filme","serie"]:
        return jsonify({"Mensagem":"Os campos são obrigatórios."}),400

    if favoritoController.criaFavorito(current_user.id,idFilme,tipo):
        return jsonify({"Mensagem":"Favorito cadastrado."}),201
    else:
        return jsonify({"Mensagem":"Falha ao cadastrar favorito."}),400
    
# Rota para deletar um filme/série como favorito do usuário
@app.route("/favoritos/<string:filme_id>",methods=["DELETE"])
@login_required
def apagarFavorito(filme_id):

    try:
        tipo = request.args.get("tipo")
        if tipo not in ["filme","serie"]:
            return jsonify({"Mensagem" : "O parâmetro 'tipo' deve ser 'filme' ou 'serie'."}) , 400
    except:
        return jsonify({"Mensagem" : "O parâmetro 'tipo' é obrigatório."}) , 400

    if favoritoController.apagarFavorito(current_user.id,filme_id,tipo):
        return jsonify({"Mensagem":"Favorito deletado."}),200
    else:
        return jsonify({"Mensagem":"Falha ao deletar favorito."}),400


# Rota para verificar a existência de um favorito do usuário
@app.route("/favoritos/<string:filme_id>",methods=["GET"])
@login_required
def verificaFavorito(filme_id):

    tipo = request.args.get("tipo")
    if tipo not in ["filme","serie"]:
        return jsonify({"Mensagem" : "O parâmetro 'tipo' deve ser 'filme' ou 'serie'"}) , 400
    
    return jsonify({"favorito":favoritoController.verificaFavorito(current_user.id,filme_id,tipo)}) , 200

# Rota para buscar todos os favoritos do usuário
@app.route("/favoritos",methods=["GET"])
@login_required
def buscaFavoritos():

    favoritos = favoritoController.buscaFavoritos(current_user.id)
    
    favoritos_json = []
    for favorito in favoritos:
        
        if favorito["tipo"] == "filme": url = "https://api.themoviedb.org/3/movie/"+favorito["filme_id"]
        if favorito["tipo"] == "serie": url = "https://api.themoviedb.org/3/tv/"+favorito["filme_id"]
        params = {
            "api_key": os.getenv("CHAVE_API_TMDB"),
            "language": "pt-BR",
        }

        resposta = requests.get(url, params=params)
        favoritos_json.append(resposta.json())

    return jsonify(favoritos_json),200






# Personalizando resposta para usuário não autorizado
@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"Mensagem": "Usuário não autenticado."}), 401


# Executando aplicação
if __name__ == "__main__":
    app.run(debug=True)