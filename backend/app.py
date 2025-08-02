################################### 18.04.25 #####################################################
# Tratar com atenção mais tarde a questão das respostas das rotas em diferentes casos de insucesso
##################################################################################################

# Importando arquivo com funções e constantes auxiliares
import auxiliar

# Importanto bibliotecas necessárias
import os
import requests
from flask import Flask, request,jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from dotenv import load_dotenv
from flask_cors import CORS
from controller import usuarioController,favoritoController,avaliacaoController

# Definindo aplicação Flask
app = Flask(__name__)

# Ativando CORS
CORS(app,supports_credentials=True)

# Configura cookies de sessão
app.config.update(
    SESSION_COOKIE_SAMESITE="None",  # Permite cookies cross-domain
    SESSION_COOKIE_SECURE=True       # Obrigatório para HTTPS
)

# Carregando variáveis de ambiente (arquivo .env)
load_dotenv()

# Configurando chave secreta da aplicação
app.secret_key = os.getenv("CHAVE_FLASK")

# Configurando o gerenciador de login da aplicação
login_manager = LoginManager(app)

# Controllers
usuarioController = usuarioController()
favoritoController = favoritoController()
avaliacaoController = avaliacaoController()

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
        return jsonify({"Mensagem":"Falha ao cadastrar usuário. Tente com outro nome."}),400

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
#@login_required
def usuario():
    try:
        nome = usuarioController.retornaUsuarioNome(current_user.id)
        return jsonify({"ID": current_user.id,"Nome": nome}),200
    except:
        return jsonify({"Mensagem": "Usuário não autenticado."}),401
    


# Rota para retornar países (requisitando API TMDB)
@app.route("/paises",methods=["GET"])
#@login_required
def paises():
    url = "https://api.themoviedb.org/3/configuration/countries"
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
    }

    resposta = requests.get(url, params=params)
    
    if resposta.status_code != 200:

        paises = auxiliar.retornaPaises()

    else:

        resposta_json = resposta.json()
        paises = []
        for i in resposta_json:
            if i["iso_3166_1"] in ["US","FR","GB","JP","IN","BR","CN","KR","MX","ES"]:
                paises.append({"label":i["native_name"],"value":i["iso_3166_1"]})


    # Ordenando dicionário de países pelo nome (campo 'label')
    paises = auxiliar.ordenaDic(paises,"label")

    return jsonify(paises), 200


# Rota para retornar gêneros de filmes (requisitando API TMDB)
@app.route("/filmes_generos",methods=["GET"])
#@login_required
def filmes_generos():
    url = "https://api.themoviedb.org/3/genre/movie/list"
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
    }
    resposta = requests.get(url, params=params)
    if resposta.status_code != 200:
        generos = auxiliar.GENEROS_FILME
    else:
        generos = resposta.json()["genres"]

    return jsonify(generos), 200

# Rota para retornar gêneros de séries (requisitando API TMDB)
@app.route("/series_generos",methods=["GET"])
#@login_required
def series_generos():
    url = "https://api.themoviedb.org/3/genre/tv/list"
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
    }
    resposta = requests.get(url, params=params)
    if resposta.status_code != 200:
        generos = auxiliar.GENEROS_SERIE
    else:
        generos = resposta.json()["genres"]

    return jsonify(generos), 200

# Rota para retornar filmes mais bem avaliados (requisitando API TMDB)
@app.route("/filmes",methods=["GET"])
#@login_required
def filmes():

    url = "https://api.themoviedb.org/3/movie/top_rated"
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
        "page": 1,
    }

    resp = requests.get(url, params=params)
    if resp.status_code != 200: return jsonify({"Mensagem": "Erro ao obter filmes da API do TMDB."}),502

    return jsonify(resp.json()["results"]), 200

# Rota para retornar séries mais bem avaliadas (requisitando API TMDB)
@app.route("/series",methods=["GET"])
#@login_required
def series():
    url = "https://api.themoviedb.org/3/tv/top_rated"
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
        "page": 1,
    }


    resp = requests.get(url, params=params)
    if resp.status_code != 200: return jsonify({"Mensagem": "Erro ao obter séries da API do TMDB."}),502

    return jsonify(resp.json()["results"]), 200


# Rota para retornar filmes buscados (requisitando API TMDB)
@app.route("/filmes_busca",methods=["GET"])
#@login_required
def filmes_busca():

    if set(request.args.keys()) != set(["termoBusca","generoBusca","paisBusca"]):
        return jsonify({"Mensagem":"Os campos devem ser somente termoBusca, generoBusca e paisBusca."}),400

    generoBusca = request.args.get("generoBusca")
    termoBusca = request.args.get("termoBusca")
    paisBusca = request.args.get("paisBusca")

    if termoBusca == "":

        # Buscando filmes por gênero e país
        url = "https://api.themoviedb.org/3/discover/movie"

        params = {
            "api_key": os.getenv("CHAVE_API_TMDB"),
            "language": "pt-BR",
            "page": 1,
            "with_genres" : generoBusca,
            "with_origin_country" : paisBusca,
        }
    
        resp = requests.get(url, params=params)
        if resp.status_code != 200: return jsonify({"Mensagem": "Erro ao obter filmes por gênero/país da API do TMDB."}),502
        return jsonify(resp.json()["results"]),200

    else:
        
        # Buscando filmes por termo
        url = "https://api.themoviedb.org/3/search/movie"

        params = {
                "api_key": os.getenv("CHAVE_API_TMDB"),
                "language": "pt-BR",
                "page": 1,
                "query" : termoBusca
        }
        resp = requests.get(url, params=params)
        if resp.status_code != 200: return jsonify({"Mensagem": "Erro ao obter filmes por nome da API do TMDB."}),502
        
        filmes = []
        
        for filme in resp.json()["results"]:

            if paisBusca != "":
                url = "https://api.themoviedb.org/3/movie/"
        
                params = {
                    "api_key": os.getenv("CHAVE_API_TMDB"),
                    "language": "pt-BR",
                }

                resp = requests.get(url+str(filme["id"]),params=params)
                if resp.status_code != 200: return jsonify({"Mensagem": "Erro ao buscar por país da API do TMDB."}),502
                pais = resp.json()["origin_country"]
            
            if (generoBusca=="" and paisBusca=="") or (generoBusca != "" and paisBusca != "" and int(generoBusca) in filme["genre_ids"] and paisBusca in pais) or (paisBusca == "" and generoBusca != "" and int(generoBusca) in filme["genre_ids"]) or (generoBusca=="" and paisBusca != "" and paisBusca in pais):
                    filmes.append(filme)
        
        
        return jsonify(filmes),200

# Rota para retornar séries buscadas (requisitando API TMDB)
@app.route("/series_busca",methods=["GET"])
#@login_required
def series_busca():

    if set(request.args.keys()) != set(["termoBusca","generoBusca","paisBusca"]):
        return jsonify({"Mensagem":"Os campos devem ser somente termoBusca, generoBusca e paisBusca."}),400

    generoBusca = request.args.get("generoBusca")
    termoBusca = request.args.get("termoBusca")
    paisBusca = request.args.get("paisBusca")

    if termoBusca == "":

        # Buscando por série gênero e país
        url = "https://api.themoviedb.org/3/discover/tv"

        params = {
            "api_key": os.getenv("CHAVE_API_TMDB"),
            "language": "pt-BR",
            "page": 1,
            "with_genres" : generoBusca,
            "with_origin_country" : paisBusca,
        }
    
        resp = requests.get(url, params=params)
        if resp.status_code != 200: 
            return jsonify({"Mensagem": "Erro ao obter séries por gênero/país da API do TMDB."}),502
        
        return jsonify(resp.json()["results"]),200

    else:
        
        # Buscando séries por termo
        url = "https://api.themoviedb.org/3/search/tv"

        params = {
                "api_key": os.getenv("CHAVE_API_TMDB"),
                "language": "pt-BR",
                "page": 1,
                "query" : termoBusca
        }
        resp = requests.get(url, params=params)
        if resp.status_code != 200: return jsonify({"Mensagem": "Erro ao obter séries por nome da API do TMDB."}),502
        
        series = []
        
        for serie in resp.json()["results"]:
            
            if  (generoBusca=="" and paisBusca=="") or (generoBusca != "" and paisBusca != "" and int(generoBusca) in serie["genre_ids"] and paisBusca in serie["origin_country"]) or (paisBusca == "" and generoBusca != "" and int(generoBusca) in serie["genre_ids"]) or(generoBusca=="" and paisBusca != "" and paisBusca in serie["origin_country"]):
                    series.append(serie)
        
        
        return jsonify(series),200

# Rota para retornar um filme específico (requisitando API TMDB)
@app.route("/filmes/<string:id>",methods=["GET"])
#@login_required
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
    
    dados = resposta.json()
    filme = {
        "nome":dados["title"],
        "data": dados["release_date"].split("-")[0],
        "duracao":str(dados["runtime"])+" min",
        "capa":"https://image.tmdb.org/t/p/w300" + dados["poster_path"],
        "wallpaper":"https://image.tmdb.org/t/p/w1280"+dados["backdrop_path"],
        "sinopse":dados["overview"],
    }
    
    generos = ""
    for i in dados["genres"]:
        generos += i["name"] + " / "
    filme["genero"] = generos[0:-3]

    return jsonify(filme),status

# Rota para retornar uma série específica (requisitando API TMDB)
@app.route("/series/<string:id>",methods=["GET"])
#@login_required
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
    
    
    dados = resposta.json()
    serie = {
        "nome":dados["name"],
        "temporadas":dados["number_of_seasons"],
        "episodios":dados["number_of_episodes"],
        "capa":"https://image.tmdb.org/t/p/w300" + dados["poster_path"],
        "wallpaper":"https://image.tmdb.org/t/p/w1280"+dados["backdrop_path"],
        "sinopse":dados["overview"],
    }

    duracao = ""
    try:
        duracao = str(dados["episode_run_time"][0])+" min"
    except: pass

    serie["duracao"] = duracao

    if dados["in_production"] == False:
       serie["data"] = dados["first_air_date"].split("-")[0] + " - " + dados["last_air_date"].split("-")[0]
    else:
        serie["data"] = dados["first_air_date"].split("-")[0] + " - "
    
    generos = ""
    for i in dados["genres"]:
        generos += i["name"] + " / "
    serie["genero"] = generos[0:-3]

    return jsonify(serie),status

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
    
    favoritos_json = {
        "filme":[],
        "serie":[]
    }

    params = {
            "api_key": os.getenv("CHAVE_API_TMDB"),
            "language": "pt-BR",
    }

    for favorito in favoritos:
        
        if favorito["tipo"] == "filme": 
            url = "https://api.themoviedb.org/3/movie/"+favorito["filme_id"]
            resposta = requests.get(url, params=params)

            if resposta.status_code != 200: return jsonify(resposta.json()),400

            dados = resposta.json()
            favoritos_json["filme"].append({
                    "img" :"https://image.tmdb.org/t/p/w300"+dados["poster_path"],
                    "nome":dados["title"],
                    "data":dados["release_date"],
                    "id":dados["id"],
                    "notaImdb":dados["vote_average"],
                    "tipo":"filme",
                    "tipo_label":"Filme",
                })

            #favoritos_json["filme"].append(resposta.json())
            
        if favorito["tipo"] == "serie": 
            url = "https://api.themoviedb.org/3/tv/"+favorito["filme_id"]
            resposta = requests.get(url, params=params)

            if resposta.status_code != 200: return jsonify(resposta.json()),400

            dados = resposta.json()
            favoritos_json["serie"].append({
                    "img" :"https://image.tmdb.org/t/p/w300"+dados["poster_path"],
                    "nome":dados["name"],
                    "data":dados["first_air_date"],
                    "id":dados["id"],
                    "notaImdb":dados["vote_average"],
                    "tipo": "serie",
                    "tipo_label":"Série",
            })

            #favoritos_json["serie"].append(resposta.json())

    return jsonify(favoritos_json),200


# Rota para buscar provedores de filme ou série (requisitando API TMDB)
@app.route("/provedores/<string:tipo>/<string:id>",methods=["GET"])
#@login_required
def provedores(tipo,id):

    if tipo == "filme": urlTipo = "movie"
    if tipo == "serie": urlTipo = "tv"
    if tipo not in ["filme","serie"]: 
        return {"Mensagem" : "O tipo de conteúdo deve ser 'filme' ou 'serie'."}, 404

    url = "https://api.themoviedb.org/3/"+urlTipo+"/"+id+"/watch/providers"
    
    params = {
        "api_key": os.getenv("CHAVE_API_TMDB"),
        "language": "pt-BR",
    }

    resposta = requests.get(url, params=params)

    resultado = resposta.json()

    # Se a resposta da API TMDB for que o id é invalido (status_code = 34), retornamos o status 404
    try:
        if resultado["status_code"] == 34:
            return jsonify({"Mensagem": "ID de filme/série inválido."}), 404
    except:
        pass

    # Gerando objeto json de resposta contendo os provedores apenas do Brasil
    provedores = {"gratuito":[],"anuncios":[],"incluso":[],"comprar":[],"alugar":[]}
    
    if "BR" in resultado["results"]:
        if "free" in resultado["results"]["BR"]:
            for i in resultado["results"]["BR"]["free"]:

                provedores["gratuito"].append({
                    "img" :"https://image.tmdb.org/t/p/w300"+i["logo_path"],
                    "nome":i["provider_name"],
                    "site":auxiliar.buscaSiteProvedor(i["provider_id"],i["provider_name"]),
                    "provedor_id":i["provider_id"]
                })
                
        if "ads" in resultado["results"]["BR"]:
            for i in resultado["results"]["BR"]["ads"]:

                provedores["anuncios"].append({
                    "img" :"https://image.tmdb.org/t/p/w300"+i["logo_path"],
                    "nome":i["provider_name"],
                    "site":auxiliar.buscaSiteProvedor(i["provider_id"],i["provider_name"]),
                    "provedor_id":i["provider_id"]
                })

        if "flatrate" in resultado["results"]["BR"]:
            for i in resultado["results"]["BR"]["flatrate"]:

                provedores["incluso"].append({
                    "img" :"https://image.tmdb.org/t/p/w300"+i["logo_path"],
                    "nome":i["provider_name"],
                    "site":auxiliar.buscaSiteProvedor(i["provider_id"],i["provider_name"]),
                    "provedor_id":i["provider_id"]
                })

        if "buy" in resultado["results"]["BR"]:
            for i in resultado["results"]["BR"]["buy"]:
                provedores["comprar"].append({
                "img" :"https://image.tmdb.org/t/p/w300"+i["logo_path"],
                "nome":i["provider_name"],
                "site":auxiliar.buscaSiteProvedor(i["provider_id"],i["provider_name"]),
                "provedor_id":i["provider_id"]
            })

        if "rent" in resultado["results"]["BR"]:
            for i in resultado["results"]["BR"]["rent"]:
                provedores["alugar"].append({
                "img" :"https://image.tmdb.org/t/p/w300"+i["logo_path"],
                "nome":i["provider_name"],
                "site":auxiliar.buscaSiteProvedor(i["provider_id"],i["provider_name"]),
                "provedor_id":i["provider_id"]
            })

    return jsonify(provedores),200

# Rota para registrar uma avaliação de filme/série do usuário
@app.route("/avaliacoes",methods=["POST"])
@login_required
def criarAvaliacao():

    if set(["filme_id","tipo","nota"]) != set(request.json.keys()): 
        return jsonify({"Mensagem":"Os campos devem ser somente 'filme_id', 'tipo' e 'nota'."}),400

    idFilme , tipo  , nota = request.json["filme_id"] , request.json["tipo"] , request.json["nota"]

    if idFilme == "" or tipo not in ["filme","serie"]:
        return jsonify({"Mensagem":"Os campos são obrigatórios."}),400

    try:
        if int(nota) < 0  or int(nota) > 5:
            return jsonify({"Mensagem":"A nota deve ser entre 0 e 5."}),400
    except:
        return jsonify({"Mensagem":"A nota deve ser um número."}),400
   
    if avaliacaoController.criaAvaliacao(current_user.id, idFilme, tipo, nota):
        return jsonify({"Mensagem":"Avaliação cadastrada."}),201
    else:
        return jsonify({"Mensagem":"Falha ao cadastrar avaliação."}),400
    

# Rota para deletar uma avaliação de filme/série do usuário
@app.route("/avaliacoes/<string:filme_id>",methods=["DELETE"])
@login_required
def apagarAvaliacao(filme_id):

    try:
        tipo = request.args.get("tipo")
        if tipo not in ["filme","serie"]:
            return jsonify({"Mensagem" : "O parâmetro 'tipo' deve ser 'filme' ou 'serie'."}) , 400
    except:
        return jsonify({"Mensagem" : "O parâmetro 'tipo' é obrigatório."}) , 400

    if avaliacaoController.apagarAvaliacao(current_user.id,filme_id,tipo):
        return jsonify({"Mensagem":"Avaliação deletada."}),200
    else:
        return jsonify({"Mensagem":"Falha ao deletar avaliação."}),400
    


# Rota para editar uma avaliação de filme/série do usuário
@app.route("/avaliacoes/<string:id>",methods=["PATCH"])
@login_required
def editarAvaliacao(id):

    if set(["nota"]) != set(request.json.keys()):
        return jsonify({"Mensagem" : "Apenas o parâmetro 'nota' é necessário."}) , 400

    try:
        nota = request.json["nota"]
        print(nota)
        if int(nota) < 1 or int(nota) > 5:
            return jsonify({"Mensagem" : "O parâmetro 'nota' deve ser um número de 1 a 5."}) , 400
    except:
        return jsonify({"Mensagem" : "O parâmetro 'nota' é obrigatório."}) , 400

    if avaliacaoController.editarAvaliacao(id,nota):
        return jsonify({"Mensagem":"Avaliação editada."}),200
    else:
        return jsonify({"Mensagem":"Falha ao editar avaliação."}),400
    

# Rota para verificar a existência de uma avaliação
@app.route("/avaliacoes/<string:filme_id>",methods=["GET"])
@login_required
def verificaAvaliacao(filme_id):

    tipo = request.args.get("tipo")
    if tipo not in ["filme","serie"]:
        return jsonify({"Mensagem" : "O parâmetro 'tipo' deve ser 'filme' ou 'serie'"}) , 400
    
    dados = avaliacaoController.verificaAvaliacao(current_user.id,filme_id,tipo)
    return jsonify(dados), 200


# Rota para buscar todas as avaliações do usuário
@app.route("/avaliacoes",methods=["GET"])
@login_required
def buscaAvaliacoes():

    avaliados = avaliacaoController.buscaAvaliacoes(current_user.id)
    
    avaliados_json = {
        "filme":[],
        "serie":[]
    }

    params = {
            "api_key": os.getenv("CHAVE_API_TMDB"),
            "language": "pt-BR",
    }

    for avaliado in avaliados:
        
        if avaliado["tipo"] == "filme": 
            url = "https://api.themoviedb.org/3/movie/"+avaliado["filme_id"]
            resposta = requests.get(url, params=params)

            if resposta.status_code != 200: return jsonify(resposta.json()),400

            dados = resposta.json()
            avaliados_json["filme"].append({
                "id": dados["id"],
                "nome":dados["title"],
                "img" :"https://image.tmdb.org/t/p/w300"+dados["poster_path"],
                "nota":avaliado["nota"],
                "data":avaliado["data"],
                "tipo":avaliado["tipo"],
                "tipo_label":"Filme",
            })

        if avaliado["tipo"] == "serie": 
            url = "https://api.themoviedb.org/3/tv/"+avaliado["filme_id"]
            resposta = requests.get(url, params=params)

            if resposta.status_code != 200: return jsonify(resposta.json()),400

            dados = resposta.json()
            avaliados_json["serie"].append({
                "id": dados["id"],
                "nome":dados["name"],
                "img" :"https://image.tmdb.org/t/p/w300"+dados["poster_path"],
                "nota":avaliado["nota"],
                "data":avaliado["data"],
                "tipo":avaliado["tipo"],
                "tipo_label":"Série",
            })

    return jsonify(avaliados_json),200


# Personalizando resposta para usuário não autorizado
@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"Mensagem": "Usuário não autenticado."}), 401


# Executando aplicação localmente
#if __name__ == "__main__":
    #app.run(debug=True)
    #app.run(host="0.0.0.0", port=5000, debug=True)

# Executando aplicação hospedada
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)