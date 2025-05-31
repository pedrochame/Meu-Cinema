// Variáveis da tela principal
let painelFilmes = document.querySelector("#painel-filmes");
let painelSeries = document.querySelector("#painel-series");
let campoTermo = document.querySelector("#campoTermo");
let campoGenero = document.querySelector("#campoGenero");
let campoPais = document.querySelector("#campoPais");
let campoTipo = document.querySelector("#campoTipo"); // 30.05.25:Campo para filtrar por filme,serie ou tudo
let btBuscar = document.querySelector("#btBuscar");

// Assim que a página é carregada, é verificado se o usuário está logado.
// Se não estiver, redirecionamos para a tela de login.
// Se estiver, chamamos as funções que se comunicarão com o back-end buscando gêneros, países e filmes/séries e configurarão os elementos a serem exibidos em tela.
document.addEventListener("DOMContentLoaded", async () => {
    esconderPagina();
    
    let usuario = await buscaUsuario();
    if(usuario == null){
        redireciona(caminho_tela_login);
    }else{
        await generos();
        await paises();
    }
    
    await buscaConteudo();

    exibirPagina();

});

// Quando o botão de busca é clicado, chamamos a função que se comunicará com o back-end na rota de pesquisa.
btBuscar.addEventListener("click", async () => {
    esconderPagina();
    await buscaConteudo();
    exibirPagina();

});

// Se forem filmes, chama a função que vai criar os elementos visuais dos filmes no painél.
// Se forem séries,  chama a função que vai criar os elementos visuais dos filmes no painél.
function configuraPainel(tipoConteudo,dados){

    switch(tipoConteudo){
        case "serie":
            document.querySelector("#painel-series-pai").style.display = "block";
            document.querySelector("#painel-series").innerHTML = "";
            dados.forEach(dado => { configuraDiv(false,dado); });
        break;
        case "filme":
            document.querySelector("#painel-filmes-pai").style.display = "block";
            document.querySelector("#painel-filmes").innerHTML = "";
            dados.forEach(dado => { configuraDiv(true,dado); });
        break;
        default:exibirErro();break;
    }

}

// Função que faz requsição ao back-end para buscar filmes/séries, de acordo com os parâmetros de busca.
async function busca(rota){

    console.log(rota);

    let response = await fetch(rota
        
        //Se for rota de busca, os parâmetros serão substituidos nos locais indicados
        .replace("{generoBusca}",campoGenero.value)
        .replace("{termoBusca}",campoTermo.value)
        .replace("{paisBusca}", campoPais.value)
        
        ,{
            method:"GET",
            credentials:"include",
        }

    );

    switch(response.status){

        default: exibirErro(); break;
        
        case 401: redireciona(caminho_tela_login); break;

        case 200:   
            let dados = await response.json();
            console.log(dados);
            return dados;

    }

}


// Função que configura os painéis visíveis e determina a rota de requsição ao back-end e chama a função que fará a requisição.
async function buscaConteudo(){

    console.clear();

    // Se forem todos os conteúdos, os painéis ficam visíveis. Se não, não.
    if(campoTipo.value == "tudo"){
        document.querySelector("#painel-series-pai").style.display = "block";
        document.querySelector("#painel-filmes-pai").style.display = "block";
    }else{
        document.querySelector("#painel-filmes-pai").style.display = "none";
        document.querySelector("#painel-series-pai").style.display = "none";
    }

    let dados = null;

    if(campoTipo.value == "filme" || campoTipo.value == "tudo"){
        
            if(campoGenero.value == "" && campoTermo.value == "" && campoPais.value == ""){
                dados = await busca(rota_filmes);
            }else{
                dados = await busca(rota_filmes_busca);
            }

            configuraPainel("filme",dados);

    }
    
    if(campoTipo.value == "serie" || campoTipo.value == "tudo"){
        
            if(campoGenero.value == "" && campoTermo.value == "" && campoPais.value == ""){
                dados = await busca(rota_series);
            }else{
                dados = await busca(rota_series_busca);
            }

            configuraPainel("serie",dados);
        
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