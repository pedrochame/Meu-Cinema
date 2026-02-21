PAISES = [
            {"label" : "Brasil"         , "value" : "BR" , "language" : "pt"},
            {"label" : "China"          , "value" : "CN" , "language" : "zh"},
            {"label" : "Coreia do Sul"  , "value" : "KR" , "language" : "ko"},
            {"label" : "Espanha"        , "value" : "ES" , "language" : "es"},
            {"label" : "Estados Unidos" , "value" : "US" , "language" : "en"},
            {"label" : "França"         , "value" : "FR" , "language" : "fr"},
            {"label" : "Índia"          , "value" : "IN" , "language" : "hi"},
            {"label" : "Japão"          , "value" : "JP" , "language" : "ja"},
            {"label" : "México"         , "value" : "MX" , "language" : "es"},
            {"label" : "Reino Unido"    , "value" : "GB" , "language" : "en"},
]

def retornaPaises():
    return PAISES

def retornaIdiomaPais(pais):
    for i in PAISES:
        if i["value"] == pais : return i["language"]
    return ""

def ordenaDic(dic,campo):
    c = 0
    while c < len(dic):
        for i in range(1,len(dic)-c):
            if dic[i][campo] < dic[i-1][campo]:
                aux = dic[i]
                dic[i] = dic[i-1]
                dic[i-1] = aux
        c += 1
    return dic








GENEROS_SERIE = [
    {"id": 10759,"name": "Action & Adventure"},
    {"id": 16,"name": "Animação"},
    {"id": 35,"name": "Comédia"},
    {"id": 80,"name": "Crime"},
    {"id": 99,"name": "Documentário"},
    {"id": 18,"name": "Drama"},
    {"id": 10751,"name": "Família"},
    {"id": 10762,"name": "Kids"},
    {"id": 9648,"name": "Mistério"},
    {"id": 10763,"name": "News"},
    {"id": 10764,"name": "Reality"},
    {"id": 10765,"name": "Sci-Fi & Fantasy"},
    {"id": 10766,"name": "Soap"},
    {"id": 10767,"name": "Talk"},
    {"id": 10768,"name": "War & Politics"},
    {"id": 37,"name": "Faroeste"}
]



GENEROS_FILME =  [
    {"id": 28,"name": "Ação"},
    {"id": 12,"name": "Aventura"},
    {"id": 16,"name": "Animação"},
    {"id": 35,"name": "Comédia"},
    {"id": 80,"name": "Crime"},
    {"id": 99,"name": "Documentário"},
    {"id": 18,"name": "Drama"},
    {"id": 10751,"name": "Família"},
    {"id": 14,"name": "Fantasia"},
    {"id": 36,"name": "História"},
    {"id": 27,"name": "Terror"},
    {"id": 10402,"name": "Música"},
    {"id": 9648,"name": "Mistério"},
    {"id": 10749,"name": "Romance"},
    {"id": 878,"name": "Ficção científica"},
    {"id": 10770,"name": "Cinema TV"},
    {"id": 53,"name": "Thriller"},
    {"id": 10752,"name": "Guerra"},
    {"id": 37,"name": "Faroeste"}
]

# Dicionário com os IDs de provedores de filmes/séries no TMDB, e seus sites
PROVEDORES_SITE = [
    { "id": 119,            "name": "Amazon Prime Video",   "site": "https://www.primevideo.com" },
    { "id": 1899,           "name": "Max",                  "site": "https://www.max.com/br/pt" },
    { "id": 1825,           "name": "Max Amazon Channel",   "site": "https://www.primevideo.com" },
    { "id": 307,            "name": "Globoplay",            "site": "https://www.globoplay.com" },
    { "id": 337,            "name": "Disney Plus",          "site": "https://www.disneyplus.com" },
    { "id": 8,              "name": "Netflix",              "site": "https://www.netflix.com" },
    { "id": 1796,           "name": "Netflix",           "site": "https://www.netflix.com" },
    { "id": 531,            "name": "Paramount Plus",       "site": "https://www.paramountplus.com" },
    { "id": 283,            "name": "Crunchyroll",          "site": "https://www.crunchyroll.com" },

]

def buscaSiteProvedor(id,name):
    for i in PROVEDORES_SITE:
        if id == i["id"]:
            return i["site"]
    return "https://www.google.com/search?q="+name

CAMINHO_TMDB_IMAGEM = "https://image.tmdb.org/t/p/w500"
CAMINHO_TMDB_IMAGEM_W = "https://image.tmdb.org/t/p/w1920"