// Variáveis da tela principal
let painelFilmes = document.querySelector("#painel-filmes");
let painelSeries = document.querySelector("#painel-series");
let campoBusca = document.querySelector("#campoBusca");
let btBuscar = document.querySelector("#btBuscar");

// Assim que a página é carregada, é verificado se o usuário está logado.
// Se não estiver, redirecionamos para a tela de login.
// Se estiver, chamamos as funções que se comunicarão com o back-end buscando filmes/séries e criando os elementos para que sejam exibidos na tela.
document.addEventListener("DOMContentLoaded", async () => {
    let usuario = await buscaUsuario();
    if(usuario == null){
        redireciona(caminho_tela_login);
    }else{
        await filmes();
        await series();
    }
});

// Quando o botão de busca é clicado, chamamos a função que se comunicará com o back-end na rota de pesquisa.
btBuscar.addEventListener("click", async () => {
    await busca();
});

// Função de pesquisa faz duas requisições ao back-end, na rota de pesquisa de filmes e na rota de pesquisa de séries.
// Depois, chamamos a função que irá configurar os painéis estabelecidos na página, criando as DIVs que representarão cada um dos filmes/séries para serem exibidos na tela.
async function busca(){

    let termoBusca = campoBusca.value;

    painelFilmes.innerHTML = "";
    painelSeries.innerHTML = "";

    let responseFilmes = await fetch(rota_filmes_busca+termoBusca,{
        method:"GET",
        credentials:"include",
    });

    let responseSeries = await fetch(rota_series_busca+termoBusca,{
        method:"GET",
        credentials:"include",
    });

    if(responseSeries.status == 401 || responseFilmes.status == 401){
        redireciona(caminho_tela_login);
    }

    let dadosFilmes = await responseFilmes.json();
    configuraPainel(true,dadosFilmes["results"]);  

    let dadosSeries = await responseSeries.json();
    configuraPainel(false,dadosSeries["results"]);

}

// Função que faz requsição ao back-end na rota de séries
async function series(){

    let response = await fetch(rota_series,{
        method:"GET",
        credentials:"include",
        
    });

    switch(response.status){
        case 401:
            redireciona(caminho_tela_login);
        break;
        
        case 200:
            let dados = await response.json();
            configuraPainel(false,dados["results"]);
        break;
    }

}

// Função que faz requsição ao back-end na rota de filmes
async function filmes(){

    let response = await fetch(rota_filmes,{
        method:"GET",
        credentials:"include"
    });

    switch(response.status){
        case 401:
            redireciona(caminho_tela_login);
        break;
        
        case 200:
            let dados = await response.json();
            configuraPainel(true,dados["results"]);
        break;
    }

}

// Função que cria uma DIV para filme/série e acrescenta como filho do elemento da página responsável por exibir os filmes ou séries (chamamos de painéis).
function configuraDiv(tipoFilme,filme){
    
    let filmeDiv = document.createElement("div");
    filmeDiv.className = "filme-div p-3 container m-3";
    filmeDiv.innerHTML = "<div class='d-flex justify-content-center'><b>{titulo}</b></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><img class='img-fluid' src='"+caminho_tmdb_imagem+"{imagem}'></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>{data_label}:</b><p>{data}</p></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>Nota Média do IMDB: </b><p>{nota}</p></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><a href='detalhes.html?tipo={tipo}&id={id}'  class='btn btn-primary'>Detalhes</a></div>";

    if(tipoFilme){
        filmeDiv.innerHTML = filmeDiv.innerHTML
        .replace("{id}",filme["id"])
        .replace("{tipo}","filme")
        .replace("{titulo}",filme["title"])
        .replace("{imagem}",filme["poster_path"])
        .replace("{data_label}","Data de Lançamento")
        .replace("{data}",converteData(filme["release_date"]))
        .replace("{nota}",filme["vote_average"]);
        painelFilmes.appendChild(filmeDiv);
    }else{
        filmeDiv.innerHTML = filmeDiv.innerHTML
        .replace("{id}",filme["id"])
        .replace("{tipo}","serie")
        .replace("{titulo}",filme["name"])
        .replace("{imagem}",filme["poster_path"])
        .replace("{data_label}","Data de Estreia")
        .replace("{data}",converteData(filme["first_air_date"]))
        .replace("{nota}",filme["vote_average"]);
        painelSeries.appendChild(filmeDiv);
    }
}

// Função que recebe um json de filmes/séries, e chama a função que configura uma DIV para cada um deles
function configuraPainel(tipoFilme, filmes){
    filmes.forEach(filme => {
        configuraDiv(tipoFilme,filme);
    });
}