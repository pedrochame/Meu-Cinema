let params = new URLSearchParams(document.location.search);
let id = parseInt(params.get("id"));
let tipo = params.get("tipo");
let titulo = document.querySelector("#titulo");
let capa = document.querySelector("#capa");
let sinopse = document.querySelector("#sinopse");
let genero = document.querySelector("#genero");
let data = document.querySelector("#data");
let duracao = document.querySelector("#duracao");



document.addEventListener("DOMContentLoaded", async () => {
    let dados = await buscaFilmeSerie(id);
    configPagina(dados);
});

function configPagina(dados){
    
    // Configurações específicas de filmes
    if(tipo == "filme"){

        titulo.textContent = dados["title"];
        
        data.textContent = "("+getAno(dados["release_date"])+")";
        
        duracao.textContent = dados["runtime"] + " min";
    
    }else{
        
        //Configurações específicas de séries

        titulo.textContent = dados["name"];
        
        if(dados["episode_run_time"].length == 0){
            duracao.style.display = "none";
        }else{
            duracao.textContent = dados["episode_run_time"] + " min";
        }
        
        data.textContent = "(" + getAno(dados["first_air_date"]) + " - ";
        
        if(dados["in_production"] == false){
            data.textContent += getAno(dados["last_air_date"]);
        }
        data.textContent += ")";
    }
    
    
    capa.src += dados["poster_path"];
    sinopse.textContent = dados["overview"];

    for(let i = 0; i < dados["genres"].length ; i++){
        genero.textContent += dados["genres"][i]["name"];
        if ( i != dados["genres"].length - 1){
            genero.textContent += "/";
        }
    }

    


}


async function buscaFilmeSerie(id){

    let url;

    if(tipo=="filme"){
        url = rota_filme+id;
    }else if(tipo=="serie"){
        url = rota_serie+id;
    }else{
        window.location = "index.html";
    }

    let response = await fetch(url,{
        method:"GET",
        credentials:"include",
    });

    if(response.status == 401){
        window.location = "login.html";
    }else if(response.status == 200){

        let dados = await response.json();

        if(dados["success"] == false){
            window.location = "index.html";
        }

        console.log(dados);

        return dados;

    }

}