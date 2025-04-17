// Variáveis da tela principal
let painelFilmes = document.querySelector("#painel-filmes");
let painelSeries = document.querySelector("#painel-series");
let campoBusca = document.querySelector("#campoBusca");
let campoGenero = document.querySelector("#campoGenero");
let btBuscar = document.querySelector("#btBuscar");
let btFavoritos = document.querySelector("#btFavoritos");

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
        await generos();
    }
    exibirPagina();
});

// Quando o botão de favoritos é clicado, redirecionamos o usuário para sua página de favoritos.
btFavoritos.addEventListener("click", async () => {
    redireciona("favoritos.html")
});

// Quando o botão de busca é clicado, chamamos a função que se comunicará com o back-end na rota de pesquisa.
btBuscar.addEventListener("click", async () => {

    let termoBusca = campoBusca.value.trim();
    let generoBusca = campoGenero.value;

    // Se o gênero for QUALQUER(valor 0) e não houver termo de busca, fazemos a busca padrão de filmes/séries
    if(generoBusca == "0" && termoBusca == ""){
        await filmes();
        await series();
    }else{
        await busca(termoBusca,generoBusca);
    }

});


// Função que faz duas requisições ao back-end, na rota de gêneros de filmes e na rota de gêneros de séries.
// Depois, chamamos a função que irá configurar o campo de seleção de gênero para a busca.
async function generos(){

    let responseFilmes = await fetch(rota_filme_generos,{
        method:"GET",
        credentials:"include",
    });

    let responseSeries = await fetch(rota_serie_generos,{
        method:"GET",
        credentials:"include",
    });

    if(responseSeries.status == 401 || responseFilmes.status == 401){
        redireciona(caminho_tela_login);
    }

    let dadosFilmes = await responseFilmes.json();
    let dadosSeries = await responseSeries.json();
    
    configuraCampoGenero(dadosFilmes,dadosSeries);

}

// Função de pesquisa faz duas requisições ao back-end, na rota de pesquisa de filmes e na rota de pesquisa de séries.
// Depois, chamamos a função que irá configurar os painéis estabelecidos na página, criando as DIVs que representarão cada um dos filmes/séries para serem exibidos na tela.
async function busca(termoBusca,generoBusca){

    let responseFilmes = await fetch(rota_filmes_busca.replace("{generoBusca}",generoBusca).replace("{termoBusca}",termoBusca),{
        method:"GET",
        credentials:"include",
    });

    let responseSeries = await fetch(rota_series_busca.replace("{generoBusca}",generoBusca).replace("{termoBusca}",termoBusca),{
        method:"GET",
        credentials:"include",
    });

    // Se uma das respostas tiver status 401 (não autorizado), redirecionamos o usuário para a tela de login
    if(responseSeries.status == 401 || responseFilmes.status == 401){
        redireciona(caminho_tela_login);
    }

    // Se uma das respostas tiver status diferente de 200 (que é o sucesso), redirecionamos o usuário para a tela de erro
    if(responseSeries.status != 200 || responseFilmes.status != 200){
        redireciona(caminho_tela_erro);
    }

    let dadosFilmes = await responseFilmes.json();
    let dadosSeries = await responseSeries.json();
    
    let filmes = dadosFilmes["results"];
    let series = dadosSeries["results"];

    // Se houver termo de busca e gênero de busca, filtra-se os filmes/séries com somente os do gênero selecionado
    if(termoBusca != "" && generoBusca != ""){

        filmes = [];

        dadosFilmes["results"].forEach(filme => {
            
            if(filme["genre_ids"].includes(parseInt(generoBusca))){
                filmes.push(filme);
            }
        
        });

        series = [];
        
        dadosSeries["results"].forEach(serie => {
            if(serie["genre_ids"].includes(parseInt(generoBusca))){
                series.push(serie);
            }
        });

    }

    configuraPainel(true,filmes);  
    configuraPainel(false,series);

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
        
        default:
            redireciona(caminho_tela_erro);
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

        default:
            redireciona(caminho_tela_erro);
        break;
    }

}

// Função que cria uma DIV para filme/série e acrescenta como filho do elemento da página responsável por exibir os filmes ou séries (chamamos de painéis).
function configuraDiv(tipoFilme,filme){
    
    let filmeDiv = document.createElement("div");
    filmeDiv.className = "filme-div p-3 container m-3";
    filmeDiv.innerHTML = "<div class='d-flex justify-content-center'><b>{titulo}</b></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><img {imagem} class='img-fluid'></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>{data_label}:</b><p>{data}</p></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><b>Nota Média do IMDB: </b><p>{nota}</p></div>";
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><a href='detalhes.html?tipo={tipo}&id={id}'  class='btn btn-primary'>Detalhes</a></div>";



    // Se não houver imagem, é colocada uma capa padrão
    let caminho_imagem = caminho_tmdb_imagem+filme["poster_path"];
    if(filme["poster_path"] == null){
        caminho_imagem = "assets/sem_capa.png";
    }


    if(tipoFilme){
        filmeDiv.innerHTML = filmeDiv.innerHTML
        .replace("{id}",filme["id"])
        .replace("{tipo}","filme")
        .replace("{titulo}",filme["title"])
        .replace("{imagem}","src='"+caminho_imagem+"'")
        .replace("{data_label}","Data de Lançamento")
        .replace("{data}",converteData(filme["release_date"]))
        .replace("{nota}",filme["vote_average"]);
        painelFilmes.appendChild(filmeDiv);
    }else{
        filmeDiv.innerHTML = filmeDiv.innerHTML
        .replace("{id}",filme["id"])
        .replace("{tipo}","serie")
        .replace("{titulo}",filme["name"])
        .replace("{imagem}","src='"+caminho_imagem+"'")
        .replace("{data_label}","Data de Estreia")
        .replace("{data}",converteData(filme["first_air_date"]))
        .replace("{nota}",filme["vote_average"]);
        painelSeries.appendChild(filmeDiv);
    }

}

// Função que recebe um json de filmes/séries, e chama a função que configura uma DIV para cada um deles
function configuraPainel(tipoFilme, filmes){

    if(tipoFilme){
        painelFilmes.innerHTML = "";
    }else{
        painelSeries.innerHTML = "";
    }

    filmes.forEach(filme => {
        configuraDiv(tipoFilme,filme);
    });
}

// Função que recebe um json de gêneros de filmes e um json de gêneros de séries, e adiciona os valores como opções no campo de gênero para busca 
function configuraCampoGenero(generosFilmes, generosSeries){


    let lista = [];

    // Todos os gêneros de filmes são colocados na lista que alimentará o elemento select da página
    generosFilmes["genres"].forEach(genero => {
        lista.push(genero);
    });

    // Somente os gêneros exclusivos de séries são incluídos na lista 
    generosSeries["genres"].forEach(genero => {
        if(!lista.some(x => x["id"] == genero["id"])){
            lista.push(genero);
        }
    });

    // Ordenando lista de gêneros
    lista = ordenaDicionario(lista,"name");
    
    // Para cada gênero da lista, adicionamos uma opção no elemento select da página
    lista.forEach(genero => {
        let op = document.createElement("option");
        op.label = genero["name"];
        op.value = genero["id"];
        campoGenero.appendChild(op);
    });

}