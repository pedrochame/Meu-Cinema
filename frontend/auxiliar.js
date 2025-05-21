// Função que recebe uma lista de dicionários e a devolve ordenada de acordo com um parâmetro
function ordenaDicionario(lista, param){
    let l = [];
    let aux;
    while(lista.length>0){
        for(let i = 1; i < lista.length; i++){
            if(lista[i][param] > lista[i-1][param]){
                aux = lista[i];
                lista[i] = lista[i-1];
                lista[i-1] = aux;
            }
        }
        l.push(lista.pop());
    }
    return l;
}

// Função que recebe uma lista e um elemento, e verifica se esse elemento está na lista
function buscaElemento(lista, elemento){
    lista.forEach(element => {
        if(element == elemento){
            return true;
        }
    });
    return false;
}

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

// Função que troca a mensagem da DIV de carregamento para mensagem de erro
function configuraErro(){
    document.querySelector("#divLoading").value = "Erro ao carregar conteúdo";
}

// Função que esconde a DIV de carregamento, exibe o corpo da página e adiciona o conteúdo do cabeçalho
function exibirPagina(){
    document.querySelector("#divConteudo").style.display = "block";
    document.querySelector("#divLoading").style.display = "none";

    // Se a página atual for Login ou Cadastro, apenas essas opções aparecem no cabeçalho (usuário deslogado)
    // Se a página atual for Dashboard, Favoritos ou Perfil, apenas essas opções aparecem (usuário logado)
    let paginaAtual = window.location.pathname.split("/")[(window.location.pathname.split("/").length-1)];
    if(paginaAtual == "login.html" || paginaAtual ==  "cadastro.html"){
        document.querySelector("#divHeader").innerHTML = "<header><div class='bg-white d-flex flex-wrap justify-content-center mb-4'><img class='img-fluid mt-4' src='assets/logo.png'></div><div class='d-flex flex-wrap justify-content-center gap-5'><div><a href='cadastro.html'>Cadastro</a></div><div><a href='login.html'>Entrar</a></div></div></header>";
    }else{
        //document.querySelector("#divHeader").innerHTML = "<header><div class='d-flex flex-wrap justify-content-center mb-4'><img class='img-fluid mt-4' src='assets/logo.png'></div><div class='d-flex flex-wrap justify-content-center gap-5'><div><a href='perfil.html'>Perfil</a></div><div><a href='index.html'>Dashboard</a></div><div><a href='favoritos.html'>Favoritos</a></div></div></header>";

        //document.querySelector("#divHeader").innerHTML = "<div class='bg-black'><div class='container'><div class='row'><div class='col-12 text-center'><img class='img-fluid mt-4' src='assets/logo.png'></div></div></div><div class='container'><div class='row'><div class='col-12 text-center'><div class='navbar justify-content-center'><a class='p-4' href='perfil.html'>PERFIL</a><a class='p-4' href='index.html'>PESQUISA</a><a class='p-4' href='favoritos.html'>FAVORITOS</a></div></div></div></div>";

        document.querySelector("#divHeader").innerHTML = "<div class='p-4 bg-black'><div class='navbar'><img class='img-fluid' src='assets/logo.png'><a href='perfil.html'>PERFIL</a><a href='index.html'>PESQUISA</a><a href='favoritos.html'>FAVORITOS</a></div></div>";
        
    }

}

// Função que exibe a DIV de carregamento e esconde o corpo da página
function esconderPagina(){
    document.querySelector("#divConteudo").style.display = "none";
    document.querySelector("#divLoading").style.display = "block";
}

// Variáveis para armazenar as rotas do back-end
let dominio = "http://127.0.0.1:5000";
let rota_login = dominio + "/login";
let rota_cadastro = dominio + "/cadastro";
let rota_logout = dominio + "/logout";
let rota_usuario = dominio + "/usuario";
let rota_filmes = dominio + "/filmes";
let rota_series = dominio + "/series";
let camposBusca = "paisBusca={paisBusca}&termoBusca={termoBusca}&generoBusca={generoBusca}";
let rota_series_busca = dominio + "/series_busca?"+camposBusca;
let rota_filmes_busca = dominio + "/filmes_busca?"+camposBusca;
let rota_filme = dominio + "/filmes/";
let rota_serie = dominio + "/series/";
let rota_serie_generos = dominio + "/series_generos";
let rota_filme_generos = dominio + "/filmes_generos";
let rota_favoritos = dominio + "/favoritos";
let rota_paises = dominio + "/paises";

// Variáveis para armazenar os caminhos para as telas
let caminho_tela_login = "login.html";
let caminho_tela_cadastro = "cadastro.html";
let caminho_tela_perfil = "perfil.html";
let caminho_tela_index = "index.html";
let caminho_tela_erro = "erro.html";

// Variáveis de imagens da API TMDB
let caminho_tmdb_imagem = "https://image.tmdb.org/t/p/w300";
let caminho_tmdb_imagem_wallpaper = "https://image.tmdb.org/t/p/w1280";