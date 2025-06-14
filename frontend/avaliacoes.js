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
        await avaliacoes();
    }
    exibirPagina();
});

// Função que faz requsição ao back-end na rota de avaliações
async function avaliacoes(){

    let response = await fetch(rota_avaliacoes,{
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
            configuraPainel(dados["filme"]);
            configuraPainel(dados["serie"]);
        break;

        default:
            exibirErro();
        break;

    }

}

// Função que cria uma DIV para filme/série e acrescenta como filho do elemento da página responsável por exibir os filmes ou séries (chamamos de painéis).
async function configuraDiv(filme){

    let filmeDiv = document.createElement("div");
    filmeDiv.className = "filme-div p-3 container m-3";

    //Título
    filmeDiv.innerHTML = "<div class='d-flex justify-content-center'><b>"+filme["nome"]+"</b></div>";
    
    //Imagem
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center' id='divImg'><a href='detalhes.html?tipo="+filme["tipo"]+"&id="+filme["id"]+"'><img src="+filme['img']+" class='img-fluid'></a></div>";
    
    //Data
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center gap-1'><b>Data:</b><p>"+converteData(filme["data"])+"</p></div>";
    
    //Nota da avaliação
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center gap-1'><b>Nota: </b><p>"+filme["nota"]+"</p></div>";
    
    //Label de Exibição (Filme ou Série)
    filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><i>"+filme["tipo_label"]+"</i></div>";





    //Indicador de avaliado e favorito (se for)
    let response = await fetch(rota_favoritos+"/"+filme["id"]+"?tipo="+filme["tipo"],{
            method:"GET",
            credentials:"include",
            headers: { "Content-Type": "application/json" },
    });

    if(response.status==200){
        let dados = await response.json();
        console.log(dados);
        if(dados["favorito"]==true){
            filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><img class='img-favorito' src='assets/favorito.png'><img class='img-avaliado' src='assets/avaliado.png'></div>";
        }else{
            filmeDiv.innerHTML += "<div class='d-flex justify-content-center'><img class='img-favorito' src='assets/avaliado.png'></div>";
        }
    }



    painelConteudo.appendChild(filmeDiv);

}

// Função que recebe um json de filmes/séries, e chama a função que configura uma DIV para cada um deles
function configuraPainel(filmes){
    filmes.forEach(filme => {
        configuraDiv(filme);
    });
}