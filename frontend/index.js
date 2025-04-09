document.addEventListener("DOMContentLoaded", async () => {
    await buscaUsuario();
    await buscaFilmesPopulares();
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
        filmeDiv.style = "width: 350px;";
        filmeDiv.innerHTML = "<b>"+filme["title"]+"</b>";
        filmeDiv.innerHTML += "<img class='img-fluid' src='https://image.tmdb.org/t/p/w500" + filme["poster_path"] + "'>";
        filmeDiv.innerHTML += "<p>"+filme["release_date"]+"</p>";
        filmeDiv.innerHTML += "<p>"+filme["vote_average"]+"</p>";
        document.querySelector("#painel-filmes").appendChild(filmeDiv);
        
    });

}