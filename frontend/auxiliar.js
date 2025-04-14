// Função que recebe uma string de data no formato yyyy-mm-dd e retorna no formato dd-mm-yyyy
function converteData(data){
    if(data == ""){
        return data;
    }
    return data.split("-")[2]+"/"+data.split("-")[1]+"/"+data.split("-")[0];
}

// Função que recebe uma string de data e retorna somente o ano
function getAno(data){
    return data.split("-")[0];
}

// Função que verifica se o usuário está logado no sistema
async function buscaUsuario(){
    let response = await fetch(rota_usuario,{
        method:"GET",
        credentials:"include"
    });

    switch(response.status){
        
        // Se a resposta for que o usuário não está autorizado (status 401), é retornado NULL
        case 401: 
            return null;
        
        // Se a resposta for positiva (status 200, usuário logado), seus dados são retornados
        case 200:
            let dados = await response.json();
            return dados;
    }

}

// Função que redireciona o usuário para outra página
function redireciona(caminho){
    window.location = caminho;
}

// Função que esconde a DIV de carregamento e exibe o corpo da página
function exibirPagina(){
    document.querySelector("#divConteudo").style.display = "block";
    document.querySelector("#divLoading").style.display = "none";
}

// Variáveis para armazenar as rotas do back-end
let dominio = "http://127.0.0.1:5000";
let rota_login = dominio + "/login";
let rota_cadastro = dominio + "/cadastro";
let rota_logout = dominio + "/logout";
let rota_usuario = dominio + "/usuario";
let rota_filmes = dominio + "/filmes";
let rota_series = dominio + "/series";
let rota_series_busca = dominio + "/series_busca?termoBusca=";
let rota_filmes_busca = dominio + "/filmes_busca?termoBusca=";
let rota_filme = dominio + "/filmes/";
let rota_serie = dominio + "/series/";
let rota_favoritos = dominio + "/favoritos";

// Variáveis para armazenar os caminhos para as telas
let caminho_tela_login = "login.html";
let caminho_tela_cadastro = "cadastro.html";
let caminho_tela_perfil = "perfil.html";
let caminho_tela_index = "index.html";

// Variáveis de imagens da API TMDB
let caminho_tmdb_imagem = "https://image.tmdb.org/t/p/w300";