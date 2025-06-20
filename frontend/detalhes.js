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
let temporadas = document.querySelector("#temporadas");
let episodios = document.querySelector("#episodios");
let btFavorito = document.querySelector("#btFavorito");
let ehFavorito = false;
let painelDetalhes = document.querySelector("#painelDetalhes");

let painelAvaliacao = document.querySelector("#painelAvaliacao");

// Assim que a página é carregada, é verificado se o usuário está logado.
// Se não estiver, redirecionamos para a tela de login.
// Se estiver, chamamos a função que se comunicará com o back-end buscando o determinado filme/série e a função que irá preencher os dados na tela com as informações obtidas.
document.addEventListener("DOMContentLoaded", async () => {
    esconderPagina();
    let usuario = await buscaUsuario();
    if(usuario == null){
        redireciona(caminho_tela_login);
    }else{
        let dados = await buscaFilmeSerie(id);
        await configBtFavorito();
        configPagina(dados);

        //Configurando provedores
        let dadosProvedores = await configProvedores();
        configPaginaProvedores(dadosProvedores);

        //Configurando painel de avaliação
        await configAvaliacao();

    }
    exibirPagina();
});

async function configAvaliacao(){
    let nota = await verificaAvaliacao();
    let avaliacaoDiv = null
    if(nota >=0){

        avaliacaoDiv = document.createElement("div");
        avaliacaoDiv.innerHTML = "<div class='container'><div class='row'><div class='col-12 text-center'><p>"+nota+"</p></div></div></div>";

    }else{
        avaliacaoDiv = document.createElement("div");
        avaliacaoDiv.innerHTML = "<div class='container'><div class='row'><div class='col-12 text-center'><input class='form-control' type='number'></div></div></div>";
    }
    painelAvaliacao.appendChild(avaliacaoDiv);


}

async function verificaAvaliacao(){
    let response = await fetch(rota_avaliacoes+"/"+id+"?tipo="+tipo,{
        method:"GET",
        credentials:"include",
    });

    switch(response.status){
        
        case 401: 
            redireciona(caminho_tela_login);
        break;
        
        case 200:
            let dados = await response.json();
            if(dados.length >0){
                console.log("o item foi avaliado pelo usuário");
                console.log(dados);
                return dados[0]['nota'];
            }else{
                console.log("o item NÃO foi avaliado pelo usuário");
                return -1;
            }
        break;
        
        default:
            exibirErro();
        break;
    
    }

}




// Função que preenche as informações de provedores do filme/série nos respectivos elementos da página
function configPaginaProvedores(dados){

    let painelProvedores = document.querySelector("#painelProvedores");

    let dic = {
        "gratuito" : "Grátis",
        "anuncios" : "Grátis com anúncios",
        "incluso"  : "Incluso na assinatura",
        "comprar"  : "Para comprar",
        "alugar"   : "Para alugar",
    };

    ["gratuito","anuncios","incluso","comprar","alugar"].forEach(x => {
            
        if(dados[x].length > 0){
           
            let divProvedor = document.createElement("div");
            divProvedor.className = "container";


            divProvedor.innerHTML = "<div class='row'><div class='col-12 text-center'><b>"+dic[x]+":</b></div></div><div class='row'><div class='col-12 d-flex flex-wrap justify-content-center' id='divProvedores_"+x+"'></div></div>";

            painelProvedores.appendChild(divProvedor);
        
        }

            
        let divProvedoresIncluso = document.querySelector("#divProvedores_incluso");
        let divProvedoresComprar = document.querySelector("#divProvedores_comprar");
        let divProvedoresAlugar = document.querySelector("#divProvedores_alugar");
        let divProvedoresGratuito = document.querySelector("#divProvedores_gratuito");
        let divProvedoresAnuncios = document.querySelector("#divProvedores_anuncios");


        dados[x].forEach(provedor => {

            let div = document.createElement("div");
            let img = document.createElement("img");
            let a = document.createElement("a");
            a.target = "_blank";
            a.href = provedor["site"];
            img.src = caminho_tmdb_imagem+provedor["img"];
            img.className = "img-fluid m-2";
            a.appendChild(img);
            div.appendChild(a);

            switch(x){
                case "incluso": divProvedoresIncluso.appendChild(div);break;
                case "comprar": divProvedoresComprar.appendChild(div);break;
                case "alugar": divProvedoresAlugar.appendChild(div);break;
                case "gratuito": divProvedoresGratuito.appendChild(div);break;
                case "anuncios": divProvedoresAnuncios.appendChild(div);break;
            }
            
        
        });


    });

}

// Função que faz requisição ao back-end para buscar os provedores do filme/série
async function configProvedores(){
    
    let response = await fetch(rota_provedores+"/"+tipo+"/"+id,{
            method:"GET",
            credentials:"include"
    });

    switch(response.status){
            case 200:
                let dados = await response.json();
                console.log(dados);
                return dados;
            break;
            case 401:
                redireciona(caminho_tela_login);
            break;
            default:
                exibirErro();
            break;
    }

}



btFavorito.addEventListener("click", async () => {


    if(ehFavorito == false){
        let response = await fetch(rota_favoritos,{
            method:"POST",
            credentials:"include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                "filme_id" : id,
                "tipo" : tipo,
            })
        });
    }else{
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
                btFavorito.value = "Remover dos favoritos";
                btFavorito.className += "btn-danger";
                ehFavorito = true;
            }else{
                console.log("o item NÃO É favorito do usuário");
                btFavorito.value = "Adicionar aos favoritos";
                btFavorito.className += "btn-success";
                ehFavorito = false;
            }
        break;
        
        default:
            exibirErro();
        break;
    
    }
    
}

// Função que preenche as informações do filme/série nos respectivos elementos da página
function configPagina(dados){

    if(tipo == "filme"){
        temporadas.style.display = "none"; // Temporadas(não há)
        episodios.style.display = "none"; // Episódios(não há)
    }else{
        temporadas.innerHTML = "<b>Temporadas: </b><p>"+dados["temporadas"]+"</p"; // Temporadas
        episodios.innerHTML  = "<b>Episódios: </b><p>"+dados["episodios"]+"</p>" // Episódios
    }

    titulo.textContent = dados["nome"]; // Título
    data.textContent = dados["data"]; // Data de lançamento
    duracao.textContent = dados["duracao"]; // Duração
    capa.src = dados["capa"]; // Capa

    // Imagem de fundo
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "rgba(255, 255, 255, 0)";
    document.querySelector("#fundoTelaDetalhes").src = dados['wallpaper'];
    document.querySelector("#fundoTelaDetalhes").style.display = "block";

    sinopse.textContent = dados["sinopse"];    // Sinopse
    genero.textContent = dados["genero"];    // Gênero

    // Completando informação do título da página
    document.title += " "+titulo.textContent;

    // Completando informação de data do filme/série
    data.textContent = "(" + data.textContent + ")";

    // Completando informação de duração
    if(duracao.textContent != ""){
        duracao.style.display = "block";
        duracao.textContent = "[" + duracao.textContent + "]";
    }else{
        duracao.style.display = "none";
    }
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
            exibirErro();
        break;
    
    }

}