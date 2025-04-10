let params = new URLSearchParams(document.location.search);
let id = parseInt(params.get("idFilme"));
let tipo = params.get("tipo");
let titulo = document.querySelector("#titulo");
let capa = document.querySelector("#capa");
let sinopse = document.querySelector("#sinopse");


document.addEventListener("DOMContentLoaded", async () => {
    await buscaFilme(id);
});


async function buscaFilme(id){

    let url;

    if(tipo=="filme"){
        url = "http://127.0.0.1:5000/filmes/"+id;
    }else if(tipo=="serie"){
        url = "http://127.0.0.1:5000/series/"+id;
    }else{
        return;
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

        if(tipo=="serie"){
            titulo.textContent = dados["name"];
        }else{
            titulo.textContent = dados["title"];
        }
        
        capa.src += dados["poster_path"];
        sinopse.textContent = dados["overview"];


    }

}