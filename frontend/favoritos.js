// Variáveis da tela principal
let painelFilmes = document.querySelector("#painel-filmes");
let painelSeries = document.querySelector("#painel-series");
let painelConteudo = document.querySelector("#painel-conteudo");

// Assim que a página é carregada, é verificado se o usuário está logado.
// Se não estiver, redirecionamos para a tela de login.
// Se estiver, chamamos as funções que se comunicarão com o back-end buscando filmes/séries e criando os elementos para que sejam exibidos na tela.
document.addEventListener("DOMContentLoaded", async () => {

    esconderPagina();


    let usuario = await buscaUsuario();
    if(usuario == null){
        redireciona(caminho_tela_login);
    }else{
        await favoritos();
    }
    exibirPagina();
});

// Função que faz requsição ao back-end na rota de favoritos
async function favoritos(){

    let response = await fetch(rota_favoritos,{
        method:"GET",
        credentials:"include"
    });

    switch(response.status){
        case 401:
            redireciona(caminho_tela_login);
        break;
        
        case 200:
            let dados = await response.json();
            console.log(dados);
            configuraPainel(true,dados["filme"]);
            configuraPainel(false,dados["serie"]);
        break;

        default:
            exibirErro();
        break;

    }

}

// Função que cria uma DIV para filme/série e acrescenta como filho do elemento da página responsável por exibir os filmes ou séries (chamamos de painéis).
function configuraDiv(tipoFilme,filme){
    
    let filmeDiv = document.createElement("div");
    filmeDiv.className = "filme-div p-3 container m-3";
    filmeDiv.innerHTML = "<div class='d-flex justify-content-center'><b>{titulo}</b></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center' id='divImg'><a href='detalhes.html?tipo={tipo}&id={id}'><img {imagem} class='img-fluid'></a></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>{data_label}:</b><p>{data}</p></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>Nota Média do IMDB: </b><p>{nota}</p></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><i>{tipoExibir}</i></div>";
    //filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><a href='detalhes.html?tipo={tipo}&id={id}'  class='btn btn-primary'>Detalhes</a></div>";



    // Se não houver imagem, é colocada uma capa padrão
    let caminho_imagem = caminho_tmdb_imagem+filme["poster_path"];
    if(filme["poster_path"] == null){
        caminho_imagem = "assets/sem_capa.png";
    }


    if(tipoFilme){
        filmeDiv.innerHTML = filmeDiv.innerHTML
        .replace("{id}",filme["id"])
        .replace("{tipo}","filme")
        .replace("{tipoExibir}","Filme")
        .replace("{titulo}",filme["title"])
        .replace("{imagem}","src='"+caminho_imagem+"'")
        .replace("{data_label}","Data de Lançamento")
        .replace("{data}",converteData(filme["release_date"]))
        .replace("{nota}",filme["vote_average"]);
        painelConteudo.appendChild(filmeDiv);
    }else{
        filmeDiv.innerHTML = filmeDiv.innerHTML
        .replace("{id}",filme["id"])
        .replace("{tipo}","serie")
        .replace("{tipoExibir}","Série")
        .replace("{titulo}",filme["name"])
        .replace("{imagem}","src='"+caminho_imagem+"'")
        .replace("{data_label}","Data de Estreia")
        .replace("{data}",converteData(filme["first_air_date"]))
        .replace("{nota}",filme["vote_average"]);
        painelConteudo.appendChild(filmeDiv);
    }

}

// Função que recebe um json de filmes/séries, e chama a função que configura uma DIV para cada um deles
function configuraPainel(tipoFilme, filmes){
    filmes.forEach(filme => {
            configuraDiv(tipoFilme,filme);
    });
}