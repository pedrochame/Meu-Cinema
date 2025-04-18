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