let painelFilmes = document.querySelector("#painel-filmes");
let painelSeries = document.querySelector("#painel-series");
let campoBusca = document.querySelector("#campoBusca");
let btBuscar = document.querySelector("#btBuscar");

document.addEventListener("DOMContentLoaded", async () => {
    await buscaUsuario();
    await buscaFilmesPopulares();
    await buscaSeriesPopulares();
});

btBuscar.addEventListener("click", async () => {
    await pesquisa();
});


async function pesquisa(){

    let termoBusca = campoBusca.value;

    painelFilmes.innerHTML = "";
    painelSeries.innerHTML = "";

    let response = await fetch(rota_filmes_busca+termoBusca,{
        method:"GET",
        credentials:"include",
    });

    if(response.status == 401){
        window.location = "login.html";
    }

    let dados = await response.json();
    configuraPainel(true,dados["results"]);  


    response = await fetch(rota_series_busca+termoBusca,{
        method:"GET",
        credentials:"include",
    });

    if(response.status == 401){
        window.location = "login.html";
    }

    dados = await response.json();
    configuraPainel(false,dados["results"]);

}

async function buscaUsuario(){
    let response = await fetch(rota_usuario,{
        method:"GET",
        credentials:"include"
    });

    if(response.status == 401){
        window.location = "login.html";
    }
}

async function buscaSeriesPopulares(){

    let response = await fetch(rota_series,{
        method:"GET",
        credentials:"include",
        
    });

    if(response.status == 401){
        window.location = "login.html";
    }

    let dados = await response.json();
    configuraPainel(false,dados["results"]);
}


async function buscaFilmesPopulares(){

    let response = await fetch(rota_filmes,{
        method:"GET",
        credentials:"include"
    });

    if(response.status == 401){
        window.location = "login.html";
    }

    let dados = await response.json();
    configuraPainel(true,dados["results"]);

}

function configuraDiv(tipoFilme,filme){
    
    let filmeDiv = document.createElement("div");
    filmeDiv.className = "filme-div p-3 container m-3";
    filmeDiv.innerHTML = "<div class='d-flex justify-content-center'><b>{titulo}</b></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><img class='img-fluid' src='https://image.tmdb.org/t/p/w300{imagem}'></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>{data_label}:</b><p>{data}</p></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>Nota Média do IMDB: </b><p>{nota}</p></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><a href='detalhes.html?tipo={tipo}&id={id}' target='_blank' class='btn btn-primary'>Detalhes</a></div>";

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

function configuraPainel(tipoFilme, filmes){
    filmes.forEach(filme => {
        configuraDiv(tipoFilme,filme);
    });
}