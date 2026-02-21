// 17.09.25 - Nas telas que aparecem os 'cards' de filmes/séries (index, favoritos e avaliados), ao passar o mouse sobre os ícones de favorito/avaliado, é exibida essa informação
document.addEventListener("mouseover", (e) => {
    let alvo = e.target;

    // Caso o título do ícone já tenha sido definido, não definir novamente
    if(alvo.title != ''){
        return;
    }

    // Caso o mouse esteja sobre o ícone de avaliado, definir título
    if(alvo.className == 'img-avaliado'){
        alvo.title = 'Este título foi avaliado por você!';
        console.log("titulo colocado");
    }

    // Caso o mouse esteja sobre o ícone de favorito, definir título
    if(alvo.className == 'img-favorito'){
        alvo.title = 'Este título é um dos seus favoritos!';
        console.log("titulo colocado");
    }

});



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

// Função que recebe uma string de data no padrão ISO 8601 e retorna no formato DD/MM/YYYY HH:MM
/*
    Exemplo:

    Recebe: 2026-01-14T10:47:58Z
    Retorna: 14/01/2026, 10:47:58

*/

function converteData(data){
    
    if(data == ""){
        return data;
    }

    if(data.split("T").length == 1){
        return data.split("-")[2]+"/"+data.split("-")[1]+"/"+data.split("-")[0];
    }


    // Criando objeto Date
    const dt = new Date(data);

    // Formatando data
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone // Fuso horário do usuário
    };

    let f = new Intl.DateTimeFormat("pt-BR", options).format(dt); 
    return f.split(", ")[0] + " às " + f.split(", ")[1].substring(0,5);

}

// Função que recebe uma string de data e retorna somente o ano
function getAno(data){
    return data.split("-")[0];
}


// Função que adiciona um ícone para indicar carregamento
function adicionarCarregamento(elementoParaEsconder){

    // Escondendo elemento
    elementoParaEsconder.style.display = "none";

    // Adicionar um pequeno gif para indicar carregamento
    let divLoading = document.createElement("div");
    divLoading.id = "divLoading";
    divLoading.className = "col-12 text-center mb-4"
    divLoading.innerHTML = "<img src='assets/loading.gif' width='48'></div>";
    elementoParaEsconder.parentElement.appendChild(divLoading);

}

// Função que remove o ícone que indica carregamento
function removerCarregamento(elementoParaExibir){

    // Exibindo elemento (revertendo alteração de display)
    elementoParaExibir.style.display = "revert";

    // Removendo ícone de carregamento
    const divLoading = elementoParaExibir.parentElement.querySelector("#divLoading");
    if(divLoading != null){
        elementoParaExibir.parentElement.removeChild(divLoading);
    }

}

// Função que faz requisição ao Back-End, na rota de deslogar usuário
async function logout(){
    let response = await fetch(rota_logout,{
        method:"GET",
        credentials:"include"
    });
        
    // Se a resposta for positiva (status 200), o usuário é redirecionado para a página de login
    if(response.status == 200){
        window.location = "login.html";
    }

}

// Função que verifica se o usuário está logado no sistema
async function buscaUsuario(){
    // Caso ocorra falha na requisição, é por conta do back-end estar fora ar, então redirecionar para página que informará ao usuário para aguardar e tentar novamente
    let response = null;
    try{
        response = await fetch(rota_usuario,{
        method:"GET",
        credentials:"include"
    });
    }catch{
        redireciona("falha.html");
    }
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

    // O atalho no cabeçalho para a página em que o usuário está fica em cor diferente
    let pagAtual = window.location.pathname.split("/")[(window.location.pathname.split("/").length-1)];
    pagAtual = pagAtual.replace(".html","");
    //console.log(pagAtual);
    let elementoAtalhoPagAtual = document.querySelector("#atalho_"+pagAtual);
    if(elementoAtalhoPagAtual){
       elementoAtalhoPagAtual.style.color = "gold";
    }


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


function esconderPagina(usuario){

    // Adicionando div de cabeçalho
    if(document.querySelector("#divHeader") == null){ 
        let header = document.createElement("div");
        header.id = "divHeader";
        
        let atalhos = [];


        // Se usuário está logado, todas as opções aparecem. Se não, somente de login e início
        //let usuario = null;
        
        // Caso ocorra alguma exceção ao buscar os dados do usuário, é por conta do back-end não responder a requisição... então, exibir mensagem para que o usuário aguarde algum tempo para atualizar a página


        //
        const divAguarde = document.createElement("div");
        divAguarde.id = "divAguarde";
        divAguarde.className = "container text-center mb-4 mt-4";
        divAguarde.innerHTML = "<img class='mb-4' src='assets/loading.gif'><p  style='color:whitesmoke;font-size:24px;' >Aguarde...</p>";
        document.body.appendChild(divAguarde);
        //
/*
        try {
            usuario = await buscaUsuario();   
        } catch (error) {

            const c = document.createElement("div");
            c.className = "container text-center mt-5";
            c.innerHTML = "<p style='color:whitesmoke;font-size:24px;' >Back-end fora do ar no momento... por favor, aguarde 30 segundos e atualize a página!";
            document.body.removeChild(divAguarde);
            document.body.appendChild(c);
            return;
        }
*/
        //
        document.body.removeChild(divAguarde);
        //

        if(usuario==null){
            atalhos = ["login","index"];
        }else{
            atalhos = ["index","favoritos","perfil","avaliacoes"];
        }

        let headerhtml = "<div class='container mt-3'>{user}<div class='row m-2'><div class='col-12 text-center'><a href='index.html'><img class='img-fluid' src='assets/logo.png'></a></div></div><div class='row'><nav class=' navbar navbar-expand-md'><div class='container-fluid d-flex justify-content-center text-center'><button class='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarConteudo' aria-controls='navbarConteudo' aria-expanded='false' aria-label='Alternar navegação'><a>Menu</a></button><div class='collapse navbar-collapse' id='navbarConteudo'><ul class='navbar-nav mx-auto mt-2'>{ATALHOS}</nav></ul></div></div></div></div>";

        // Caso o usuário esteja logado, adicionar ao cabeçalho seu nome e link para deslogar
        if(usuario==null){
            headerhtml = headerhtml.replace("{user}","");
        }else{
            headerhtml = headerhtml.replace("{user}",
                "<div class='container'><div class='row'><div class='col-12 text-center'><p>Olá, "+usuario["Nome"]+"! (<a onclick='logout()'>Sair</a>)</p></div></div></div>");
        }
        //


        let atalhoshtml = "";
        atalhos.forEach(a => {

            if(a == "avaliacoes"){
                atalhoshtml += "<li class='nav-item'><a id='atalho_"+a+"'  class='nav-link active' href='"+a+".html'>Avaliações</a></li>";
            }else if(a == "index"){

                atalhoshtml += "<li class='nav-item'><a id='atalho_"+a+"'  class='nav-link active' href='"+a+".html'>Início</a></li>";
            }else{
                atalhoshtml += "<li class='nav-item'><a id='atalho_"+a+"'  class='nav-link active' href='"+a+".html'>"+a.charAt(0).toUpperCase()+a.slice(1)+"</a></li>";
            
            }

        });
        header.innerHTML = headerhtml.replace("{ATALHOS}",atalhoshtml);
        document.body.append(header);
    }


    // Escondendo div de conteúdo
    document.querySelector("#divConteudo").style.display = "none";

    // Adicionando div de rodapé
    // Obs.: Quando estivermos na página de Dashboard, que é onde acontecem as buscas por filme/série, deve-se verificar se o elemento rodapé já não foi adicionado, pois esta função é chamada sempre que o botão de busca é clicado.
    if(document.querySelector("#divFooter") == null){
        let footer = document.createElement("div");
        footer.id = "divFooter";
        footer.innerHTML = "<div class='container'><div class='row'><div class='col-12 text-center'><p>Fonte de Informações: <b>The Movie Database</b> e <b>JustWatch</b></p><p>Desenvolvido por <b>Pedro Chame</b></p></div></div></div><div class='row'><div class='col-12 text-center'><a class=' m-4' target='_blank' href='https://www.github.com/pedrochame'><img class='img-fluid' id='icone-github' src='assets/github1.png'/></a><a class='m-4' target='_blank' href='https://www.linkedin.com/in/pedrochame'><img class='img-fluid' id='icone-linkedin' src='assets/linkedin1.png'/></a></div></div></div>";
        
        document.body.appendChild(footer);
    }




            // Adicionando div de carregamento
        if(document.querySelector("#divLoading") == null){

            let loading = document.createElement("div");
            loading.id = "divLoading";
            loading.className = "flex-fill container";
            loading.innerHTML = "<div class='row'><div class='col-12 text-center mt-5 mb-5 '><img src='assets/loading.gif'></div></div></div>";
            document.body.appendChild(loading);

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

let dominio = "";
if(location.pathname.substring(0,5) == "https"){
    console.log("hospedagem");
    dominio = "https://meu-cinema-backend.onrender.com";
}else{
    console.log("local");
    dominio = "http://127.0.0.1:5000";
};

// Variáveis para armazenar as rotas do back-end
let rota_login = dominio + "/login";
let rota_cadastro = dominio + "/cadastro";
let rota_logout = dominio + "/logout";
let rota_usuario = dominio + "/usuario";
let rota_filmes = dominio + "/filmes";
let rota_series = dominio + "/series";
let camposBusca = "paisBusca={paisBusca}&termoBusca={termoBusca}&generoBusca={generoBusca}&anoBusca={anoBusca}";
let rota_series_busca = dominio + "/series_busca?"+camposBusca;
let rota_filmes_busca = dominio + "/filmes_busca?"+camposBusca;
let rota_filme = dominio + "/filmes/";
let rota_serie = dominio + "/series/";
let rota_serie_generos = dominio + "/series_generos";
let rota_filme_generos = dominio + "/filmes_generos";
let rota_favoritos = dominio + "/favoritos";
let rota_paises = dominio + "/paises";
let rota_provedores = dominio + "/provedores";
let rota_avaliacoes = dominio + "/avaliacoes"


// Variáveis para armazenar os caminhos para as telas
let caminho_tela_login = "login.html";
let caminho_tela_cadastro = "cadastro.html";
let caminho_tela_perfil = "perfil.html";
let caminho_tela_index = "index.html";
let caminho_tela_avaliacoes = "avaliacoes.html";