// Função que recebe uma lista de dicionários e a devolve ordenada de acordo com um parâmetro
function ordenaDicionario(lista, param){
    let l = [];
    let aux;
    while(lista.length>0){
        for(let i = 1; i < lista.length; i++){
            if(lista[i][param] > lista[i-1][param]){
                aux = lista[i];
                lista[i] = lista[i-1];
                lista[i-1] = aux;
            }
        }
        l.push(lista.pop());
    }
    return l;
}

// Função que recebe uma lista e um elemento, e verifica se esse elemento está na lista
function buscaElemento(lista, elemento){
    lista.forEach(element => {
        if(element == elemento){
            return true;
        }
    });
    return false;
}

// Função que recebe uma string de data no formato yyyy-mm-dd e retorna no formato dd-mm-yyyy
function converteData(data){
    
    if(data == ""){
        return data;
    }
    return data.split("-")[2]+"/"+data.split("-")[1]+"/"+data.split("-")[0];
}

// Função que recebe uma string de data e retorna somente o ano
function getAno(data){
    return data.split("-")[0];
}

// Função que verifica se o usuário está logado no sistema
async function buscaUsuario(){
    let response = await fetch(rota_usuario,{
        method:"GET",
        credentials:"include"
    });

    switch(response.status){
        
        // Se a resposta for que o usuário não está autorizado (status 401), é retornado NULL
        case 401: 
            return null;
        
        // Se a resposta for positiva (status 200, usuário logado), seus dados são retornados
        case 200:
            let dados = await response.json();
            return dados;
    }

}

// Função que redireciona o usuário para outra página
function redireciona(caminho){
    window.location = caminho;
}

// Função que altera o conteúdo da página para exibir uma mensagem de erro
function exibirErro(){
    document.querySelector("#divConteudo").innerHTML = "<div style='color:white;' class='container'><div class='row'><div class='col-12 text-center'><h2>Erro</h2><p>Desculpe, algo deu errado...</p></div></div></div>";
}

function exibirPagina(){


    // Exibindo div de conteúdo
    document.querySelector("#divConteudo").style.display = "block";

    // Para que a estrutura da página fique correta (divHeader em cima, divConteudo abaixo e divFooter depois), precisamos remover e adicionar as divs, para reorganizar
    let divConteudo = document.querySelector("#divConteudo");
    let divLoading = document.querySelector("#divLoading");
    let divHeader = document.querySelector("#divHeader");
    let divFooter = document.querySelector("#divFooter");
    document.body.removeChild(divLoading);
    document.body.removeChild(divHeader);
    document.body.removeChild(divConteudo);
    document.body.removeChild(divFooter);
    document.body.appendChild(divHeader);
    document.body.appendChild(divConteudo);
    document.body.appendChild(divFooter);




    personalizaIconesFooter();
}

// Função que implementa o efeito de trocar a imagem dos ícones das redes sociais no rodapé ao passar o mouse
function personalizaIconesFooter(){
    let redes = ['github','linkedin'];
    redes.forEach(rede =>{
        document.querySelector('#icone-'+rede).addEventListener('mouseover',()=>{
            document.querySelector('#icone-'+rede).src = 'assets/'+rede+'2.png';
        });
        document.querySelector('#icone-'+rede).addEventListener('mouseout',()=>{
            document.querySelector('#icone-'+rede).src = 'assets/'+rede+'1.png';
        });
    });
}


function esconderPagina(){



    // Adicionando div de cabeçalho
    if(document.querySelector("#divHeader") == null){ 
        let header = document.createElement("div");
        header.id = "divHeader";


        let pagAtual = window.location.pathname.split("/")[(window.location.pathname.split("/").length-1)];
        let atalhos = [];
        // Se a página atual for Login ou Cadastro, apenas essas opções aparecem no cabeçalho (usuário deslogado)
        if(pagAtual == "login.html" || pagAtual == "cadastro.html"){
            atalhos = ["login","cadastro"];
        }else{
        // Se a página atual não for login ou cadastro, apenas as outras opções aparecem (usuário logado)
            atalhos = ["index","favoritos","perfil"];
        }

        let headerhtml = "<div class='container mt-3'><div class='row m-2'><div class='col-12 text-center'><img class='img-fluid' src='assets/logo.png'></div></div><div class='row'><nav class=' navbar navbar-expand-md'><div class='container-fluid d-flex justify-content-center text-center'><button class='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarConteudo' aria-controls='navbarConteudo' aria-expanded='false' aria-label='Alternar navegação'><a>Menu</a></button><div class='collapse navbar-collapse' id='navbarConteudo'><ul class='navbar-nav mx-auto mt-2'>{ATALHOS}</nav></ul></div></div></div></div>";

        let atalhoshtml = "";
        atalhos.forEach(a => {
            //atalhoshtml += "<a href='"+a+".html'>"+a.toUpperCase()+"</a>";

            atalhoshtml += "<li class='nav-item'><a class='nav-link active' href='"+a+".html'>"+a.charAt(0).toUpperCase()+a.slice(1)+"</a></li>";

        });
        header.innerHTML = headerhtml.replace("{ATALHOS}",atalhoshtml);
        document.body.append(header);
    }



    // Escondendo div de conteúdo
    document.querySelector("#divConteudo").style.display = "none";

    // Adicionando div de carregamento
    if(document.querySelector("#divLoading") == null){
        let loading = document.createElement("div");
        loading.id = "divLoading";
        loading.className = "flex-fill";
        loading.innerHTML = "<div class='container'><div class='row'><div class='col-12 text-center'><p>Carregando conteúdo...</p></div></div></div></div>";
        document.body.appendChild(loading);
    }


    // Adicionando div de rodapé
    // Obs.: Quando estivermos na página de Dashboard, que é onde acontecem as buscas por filme/série, deve-se verificar se o elemento rodapé já não foi adicionado, pois esta função é chamada sempre que o botão de busca é clicado.
    if(document.querySelector("#divFooter") == null){
        let footer = document.createElement("div");
        footer.id = "divFooter";
        footer.innerHTML = "<div class='container'><div class='row'><div class='col-12 text-center'><p>Desenvolvido por <b>Pedro Chame</b></p></div></div><div class='row'><div class='col-12 text-center'><a class=' m-4' target='_blank' href='https://www.github.com/pedrochame'><img class='img-fluid' id='icone-github' src='assets/github1.png'/></a><a class='m-4' target='_blank' href='https://www.linkedin.com/in/pedrochame'><img class='img-fluid' id='icone-linkedin' src='assets/linkedin1.png'/></a></div></div></div>";
        
        document.body.appendChild(footer);
    }



    // Para que a estrutura da página fique correta (divHeader em cima, divLoading abaixo e divFooter depois), precisamos remover e adicionar as divs, para reorganizar
    let divLoading = document.body.querySelector("#divLoading");
    let divHeader = document.body.querySelector("#divHeader");
    let divFooter = document.body.querySelector("#divFooter");
    document.body.removeChild(divHeader);
    document.body.removeChild(divLoading);
    document.body.removeChild(divFooter);
    document.body.appendChild(divHeader);
    document.body.appendChild(divLoading);
    document.body.appendChild(divFooter);
            
    personalizaIconesFooter();
}

// Variáveis para armazenar as rotas do back-end

//let dominio = "http://127.0.0.1:5000";
let dominio = "http://192.168.3.13:5000";

let rota_login = dominio + "/login";
let rota_cadastro = dominio + "/cadastro";
let rota_logout = dominio + "/logout";
let rota_usuario = dominio + "/usuario";
let rota_filmes = dominio + "/filmes";
let rota_series = dominio + "/series";
let camposBusca = "paisBusca={paisBusca}&termoBusca={termoBusca}&generoBusca={generoBusca}";
let rota_series_busca = dominio + "/series_busca?"+camposBusca;
let rota_filmes_busca = dominio + "/filmes_busca?"+camposBusca;
let rota_filme = dominio + "/filmes/";
let rota_serie = dominio + "/series/";
let rota_serie_generos = dominio + "/series_generos";
let rota_filme_generos = dominio + "/filmes_generos";
let rota_favoritos = dominio + "/favoritos";
let rota_paises = dominio + "/paises";



let rota_provedores_filme = dominio + "/provedores_filme";
let rota_provedores_serie = dominio + "/provedores_serie";



// Variáveis para armazenar os caminhos para as telas
let caminho_tela_login = "login.html";
let caminho_tela_cadastro = "cadastro.html";
let caminho_tela_perfil = "perfil.html";
let caminho_tela_index = "index.html";

// Variáveis de imagens da API TMDB
let caminho_tmdb_imagem = "https://image.tmdb.org/t/p/w300";
let caminho_tmdb_imagem_wallpaper = "https://image.tmdb.org/t/p/w1280";