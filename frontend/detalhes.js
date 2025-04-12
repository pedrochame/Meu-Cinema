// Variáveis da tela de detalhes de filme/série
let params = new URLSearchParams(document.location.search);
let id = params.get("id");
let tipo = params.get("tipo");
let titulo = document.querySelector("#titulo");
let capa = document.querySelector("#capa");
let sinopse = document.querySelector("#sinopse");
let genero = document.querySelector("#genero");
let data = document.querySelector("#data");
let duracao = document.querySelector("#duracao");
let btFavorito = document.querySelector("#btFavorito");

// Assim que a página é carregada, é verificado se o usuário está logado.
// Se não estiver, redirecionamos para a tela de login.
// Se estiver, chamamos a função que se comunicará com o back-end buscando o determinado filme/série e a função que irá preencher os dados na tela com as informações obtidas.
document.addEventListener("DOMContentLoaded", async () => {
    let usuario = await buscaUsuario();
    if(usuario == null){
        redireciona(caminho_tela_login);
    }else{
        let dados = await buscaFilmeSerie(id);
        await configBtFavorito();
        configPagina(dados);
    }
});


btFavorito.addEventListener("click", async () => {


    if(btFavorito.value == "Favoritar"){
        let response = await fetch(rota_favoritos,{
            method:"POST",
            credentials:"include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                "filme_id" : id,
                "tipo" : tipo,
            })
        });
    }else if(btFavorito.value == "Desfavoritar"){
        let response = await fetch(rota_favoritos+"/"+id+"?tipo="+tipo,{
            method:"DELETE",
            credentials:"include",
        });
    }

    
    await configBtFavorito();


});


async function configBtFavorito(){

    let response = await fetch(rota_favoritos+"/"+id+"?tipo="+tipo,{
        method:"GET",
        credentials:"include",
    });

    switch(response.status){
        
        case 401: 
            redireciona(caminho_tela_login);
        break;
        
        case 200:
            let dados = await response.json();
            if(dados["favorito"]){
                console.log("o item é favorito do usuário");
                btFavorito.value = "Desfavoritar";
            }else{
                console.log("o item NÃO É favorito do usuário");
                btFavorito.value = "Favoritar";
            }
        break;
        
        default:
            redireciona(caminho_tela_index);
        break;
    
    }
    
}

// Função que preenche as informações do filme/série nos respectivos elementos da página
function configPagina(dados){

    switch(tipo){

        // Informações de filme
        case "filme":
            titulo.textContent = dados["title"]; // Título
            data.textContent = getAno(dados["release_date"]); // Data de lançamento
            duracao.textContent = dados["runtime"]; // Duração
        break;

        // Informações de série
        case "serie":
            titulo.textContent = dados["name"]; // Título
            duracao.textContent = dados["episode_run_time"]; // Duração
            data.textContent = getAno(dados["first_air_date"]) + " - "; // Data de início
            if(dados["in_production"] == false){
                data.textContent += getAno(dados["last_air_date"]); // Data de fim
            }
        break;
        
    }
    
    
    capa.src = caminho_tmdb_imagem+dados["poster_path"];
    sinopse.textContent = dados["overview"];

    for(let i = 0; i < dados["genres"].length ; i++){
        genero.textContent += dados["genres"][i]["name"];
        if ( i != dados["genres"].length - 1){
            genero.textContent += "/";
        }
    }
    

    // Completando informação do título da página
    document.title += " "+titulo.textContent;

    // Completando informação de duração do filme/série
    duracao.textContent = "[" + duracao.textContent + " min]";

    // Completando informação de data do filme/série
    data.textContent = "(" + data.textContent + ")";

}

// Função que faz requisição ao back-end na rota de filmes ou na rota de séries
async function buscaFilmeSerie(id){

    let url;

    switch(tipo){
        case "filme": url = rota_filme + id; break;
        case "serie": url = rota_serie + id; break;
        default: redireciona(caminho_tela_index); break;
    }

    let response = await fetch(url,{
        method:"GET",
        credentials:"include",
    });

    switch(response.status){
        
        case 401: 
            redireciona(caminho_tela_login);
        break;
        
        case 200:

            let dados = await response.json();
            console.log(dados);
            return dados;

        default:
            redireciona(caminho_tela_index);
        break;
    
    }

}