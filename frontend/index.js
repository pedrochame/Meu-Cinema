// Variáveis da tela principal
let painelFilmes = document.querySelector("#painel-filmes");
let painelSeries = document.querySelector("#painel-series");
let campoBusca = document.querySelector("#campoBusca");
let campoGenero = document.querySelector("#campoGenero");
let campoPais = document.querySelector("#campoPais");
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
        await generos();
        await paises();
    }
    exibirPagina();
});

// Quando o botão de busca é clicado, chamamos a função que se comunicará com o back-end na rota de pesquisa.
btBuscar.addEventListener("click", async () => {

    let termoBusca = campoBusca.value.trim();
    let generoBusca = campoGenero.value;
    let paisBusca = campoPais.value;

    esconderPagina();

    // Se o gênero e país forem QUALQUER (sem valor) e não houver termo de busca, fazemos a busca padrão de filmes/séries
    if(generoBusca == "" && termoBusca == "" && paisBusca == ""){
        await filmes();
        await series();
    }else{
        await busca(termoBusca,generoBusca,paisBusca);
    }

    exibirPagina();

});


// Função que faz uma requisição ao back-end na rota de países de filmes/séries.
// Depois, chamamos a função que irá configurar o campo de seleção de país para a busca.
async function paises(){

    let responsePaises = await fetch(rota_paises,{
        method:"GET",
        credentials:"include",
    });

    if(responsePaises == 401){
        redireciona(caminho_tela_login);
    }

    let dadosPaises = await responsePaises.json();
    
    configuraCampoPais(dadosPaises);

}

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
async function busca(termoBusca,generoBusca,paisBusca){

    let responseFilmes = await fetch(rota_filmes_busca
        .replace("{generoBusca}",generoBusca)
        .replace("{termoBusca}",termoBusca)
        .replace("{paisBusca}", paisBusca),
        {
            method:"GET",
            credentials:"include",
        }
    );

    let responseSeries = await fetch(rota_series_busca
        .replace("{generoBusca}",generoBusca)
        .replace("{termoBusca}",termoBusca)
        .replace("{paisBusca}", paisBusca),
        {
            method:"GET",
            credentials:"include",
        }
    );

    // Se uma das respostas tiver status 401 (não autorizado), redirecionamos o usuário para a tela de login
    if(responseSeries.status == 401 || responseFilmes.status == 401){
        redireciona(caminho_tela_login);
    }

    // Se uma das respostas tiver status diferente de 200 (que é o sucesso), redirecionamos o usuário para a tela de erro
    if(responseSeries.status != 200 || responseFilmes.status != 200){
        redireciona(caminho_tela_erro);
    }

    let filmes = await responseFilmes.json();
    let series = await responseSeries.json();

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
            console.log(dados);
            configuraPainel(false,dados);
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
            console.log(dados);
            configuraPainel(true,dados);
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
    filmeDiv.innerHTML += "<div id='divImg' class='d-flex justify-content-center'><a href='detalhes.html?tipo={tipo}&id={id}'><img {imagem} class='img-fluid'></a></div>";
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
        painelFilmes.appendChild(filmeDiv);
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
    generosFilmes.forEach(genero => {
        lista.push(genero);
    });

    // Somente os gêneros exclusivos de séries são incluídos na lista 
    generosSeries.forEach(genero => {
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


// Função que recebe um json de países de filmes/séries e adiciona os valores como opções no campo de país para busca 
function configuraCampoPais(paises){
    
    // Para cada país, adicionamos uma opção no elemento select da página
    paises.forEach(pais => {
        let op = document.createElement("option");
        op.label = pais["label"];
        op.value = pais["value"];
        campoPais.appendChild(op);
    });

}