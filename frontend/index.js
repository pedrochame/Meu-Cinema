document.addEventListener("DOMContentLoaded", async () => {
    await buscaUsuario();
    await buscaFilmesPopulares();
    await buscaSeriesPopulares();
});

async function buscaUsuario(){
    let response = await fetch("http://127.0.0.1:5000/usuario",{
        method:"GET",
        credentials:"include"
    });

    let dados = await response.json();

    if(response.status!=200){
        window.location = "login.html";
    }
}

async function buscaSeriesPopulares(){

    let response = await fetch("http://127.0.0.1:5000/series_populares",{
        method:"GET",
        credentials:"include"
    });

    if(response.status!=200){
        window.location = "login.html";
    }

    let dados = await response.json();
    let filmes = dados["results"];
    filmes.forEach(filme => {

        let filmeDiv = document.createElement("div");
        filmeDiv.className = "p-3 container border m-3";
        filmeDiv.style = "width: 400px;";
        filmeDiv.innerHTML = "<div class='d-flex justify-content-center'><b>"+filme["name"]+"</b></div>";
        filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><img class='img-fluid' src='https://image.tmdb.org/t/p/w300" + filme["poster_path"] + "'></div>";
        filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>Data de Estreia: </b><p>"+filme["first_air_date"]+"</p></div>";
        filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>Nota Média do IMDB: </b><p>"+filme["vote_average"]+"</p></div>";
        document.querySelector("#painel-series").appendChild(filmeDiv);
        
    });
}


async function buscaFilmesPopulares(){

    let response = await fetch("http://127.0.0.1:5000/filmes_populares",{
        method:"GET",
        credentials:"include"
    });

    if(response.status!=200){
        window.location = "login.html";
    }

    let dados = await response.json();
    let filmes = dados["results"];
    filmes.forEach(filme => {

        let filmeDiv = document.createElement("div");
        filmeDiv.className = "p-3 container border m-3";
        filmeDiv.style = "width: 400px;";
        filmeDiv.innerHTML = "<div class='d-flex justify-content-center'><b>"+filme["title"]+"</b></div>";
        filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><img class='img-fluid' src='https://image.tmdb.org/t/p/w300" + filme["poster_path"] + "'></div>";
        filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>Data de Lançamento: </b><p>"+filme["release_date"]+"</p></div>";
        filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>Nota Média do IMDB: </b><p>"+filme["vote_average"]+"</p></div>";
        document.querySelector("#painel-filmes").appendChild(filmeDiv);
        
    });

}