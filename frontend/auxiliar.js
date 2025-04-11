function converteData(data){
    return data.split("-")[2]+"/"+data.split("-")[1]+"/"+data.split("-")[0];
}

function getAno(data){
    return data.split("-")[0];
}



let dominio = "http://127.0.0.1:5000";

let rota_usuario = dominio + "/usuario";

let rota_filmes = dominio + "/filmes";
let rota_series = dominio + "/series";
let rota_series_busca = dominio + "/series_busca?termoBusca=";
let rota_filmes_busca = dominio + "/filmes_busca?termoBusca=";
let rota_filme = dominio + "/filmes/";
let rota_serie = dominio + "/series/";