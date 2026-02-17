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


let ehAvaliado = false;
let idAvaliacao = 0;
let painelAvaliacao = document.querySelector("#painelAvaliacao");

// 26.07.25 -> Variável para indicar se o usuário está ou não logado
let usuarioLogado = false;

// 17.02.26 -> Variável que indica o máximo de nota (passado de 5 para 10)
let estrelas = 10;

// Assim que a página é carregada, é verificado se o usuário está logado.
// Se não estiver, redirecionamos para a tela de login.
// Se estiver, chamamos a função que se comunicará com o back-end buscando o determinado filme/série e a função que irá preencher os dados na tela com as informações obtidas.
document.addEventListener("DOMContentLoaded", async () => {
    esconderPagina();
    let usuario = await buscaUsuario();
    if(usuario!=null){
        usuarioLogado = true;
    }else{
        usuarioLogado = false;
    }
    //if(usuario == null){
       // redireciona(caminho_tela_login);
    //}else{
        let dados = await buscaFilmeSerie(id);

        await configBtFavorito();

        configPagina(dados);

        //Configurando provedores
        let dadosProvedores = await configProvedores();
        configPaginaProvedores(dadosProvedores);

        //Configurando painel de avaliação
        await configAvaliacao();

    //}
    exibirPagina();
});

// Função que configura a DIV responsável pela exibição da avaliação feita pelo usuário
async function configAvaliacao(){
    
    let dados = await verificaAvaliacao();

    if(dados != -1){

        //26.07.25 -> Resetando estrelas de avaliação
        for(let i = 1; i<=estrelas;i++){
            document.querySelector("#estrela"+i).src = 'assets/estrela0.png';
        }


        if(dados == null){

            ehAvaliado = false;
            document.querySelector("#divRemoverAvaliacao").style.display="none";

            //26.07.25 -> Como não há avaliação, trocar texto da data para 'Não avaliado'
            document.querySelector("#dataAvaliacao").textContent = "Não avaliado";

        }else{

            idAvaliacao = dados['id'];
            notaAvaliacao = dados['nota'];
            dataAvaliacao = dados['data'];
            ehAvaliado = true;
            document.querySelector("#divRemoverAvaliacao").style.display="block";

            for(let i = 1 ; i <= notaAvaliacao; i++){
                document.querySelector("#estrela"+i).src = 'assets/estrela1.png';
            }



            document.querySelector("#dataAvaliacao").textContent = "Avaliado em "+ converteData(dataAvaliacao);


        }

        liberarAvaliacao();
    
    }else{

        // Usuário não autenticado
        document.querySelector("#painelAvaliacao").innerHTML = "";//"<p>Faça login para avaliar esse título!</p>";

    }

}

//Se o filme/série não tiver sido avaliado, ao passar o mouse sobre as estrelas, elas mudam de cor, indicando a nota que o usuário está dando.
function liberarAvaliacao(){

    for(let i = 1; i<=estrelas;i++){

        document.querySelector("#estrela"+i).addEventListener("mouseover", ()=>{
            for(let j = 1; j<= i; j++){
                document.querySelector("#estrela"+j).src = 'assets/estrela1.png';
            }    
        });

        document.querySelector("#estrela"+i).addEventListener("mouseout", ()=>{
                
            if(ehAvaliado){
                for(let j = 1; j<= notaAvaliacao; j++){
                    document.querySelector("#estrela"+j).src = 'assets/estrela1.png';
                }
                for(let j = notaAvaliacao+1; j<= estrelas; j++){
                    document.querySelector("#estrela"+j).src = 'assets/estrela0.png';
                }
            }else{
                for(let j = 1; j<= i; j++){
                    document.querySelector("#estrela"+j).src = 'assets/estrela0.png';
                }    
            }
        });
    
    }

}

// 26.07.25 -> Ao clicar numa estrela, a respectiva nota é enviada na rota de avaliações no back-end
for(let i=1;i<=estrelas;i++){
    document.querySelector("#estrela"+i).addEventListener("click", async ()=>{
        

        // Adicionando ícone de carregamento no lugar do painel de avaliação
        adicionarCarregamento(painelAvaliacao);
        
        
        //console.log("NOTA ENVIADA = "+i);
        await enviarAvaliacao(i);



        // Removendo ícone de carregamento
        removerCarregamento(painelAvaliacao);

    });
}


//Função que faz requisição na rota de inclusão de avaliação
async function enviarAvaliacao(nota) {
    
    let response = null;

    if(ehAvaliado == false){
        
        response = await fetch(rota_avaliacoes,{
                method:"POST",
                credentials:"include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    "filme_id" : id,
                    "tipo" : tipo,
                    "nota" : nota,
                })
        });

    }else{
            
        response = await fetch(rota_avaliacoes+"/"+idAvaliacao,{
                method:"PATCH",
                credentials:"include",
                headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ 
                    "nota" : nota,
                })
        });

    }
    
    if(response!=null){
        let dados = await response.json();
        console.log(dados);
        if(response.status==200){
            //console.log("Avaliação feita com sucesso!");
            await configAvaliacao();
        }else{
            //console.log("Falha ao registrar avaliação.");
            await configAvaliacao();
        }
    }
}

//Função que faz requisição ao back-end para verificar a avaliação do usuário sobre o filme/série
async function verificaAvaliacao(){
    let response = await fetch(rota_avaliacoes+"/"+id+"?tipo="+tipo,{
        method:"GET",
        credentials:"include",
    });

    switch(response.status){
        
        case 401: 
            //redireciona(caminho_tela_login);
            console.log("Usuário não autenticado.");
            return -1;
        break;
        
        case 200:
            let dados = await response.json();
            if(dados.length >0){
                console.log("Item avaliado.");
                console.log(dados);
                return dados[0];
            }else{
                console.log("Item não avaliado.");
                return null;
            }
        break;
        
        default:
            exibirErro();
        break;
    
    }

}

// Se o filme/série tiver avaliação, o botão de remover avaliação estará disponível.
// Se for clicado, deve se comunicar com o back-end na rota de deleção de avaliação.
document.querySelector("#btRemoverAvaliacao").addEventListener("click", async () => {

    // Adicionando ícone de carregamento no lugar do painel de avaliação
    adicionarCarregamento(painelAvaliacao);

    let response = await fetch(rota_avaliacoes+"/"+id+"?filme_id="+id+"&tipo="+tipo,{
                                method:"DELETE",
                                credentials:"include",
    });

    await configAvaliacao();

    // Removendo ícone de carregamento
    removerCarregamento(painelAvaliacao);

});










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


    // Enquanto é feita a requisição ao back-end para incluir/remover favorito, o botão deve permanecer escondido, com o ícone de carregamento em seu lugar
    adicionarCarregamento(btFavorito);


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


    // Fim do carregamento
    removerCarregamento(btFavorito);

});


async function configBtFavorito(){

    let response = await fetch(rota_favoritos+"/"+id+"?tipo="+tipo,{
        method:"GET",
        credentials:"include",
    });

    switch(response.status){
        
        case 401: 
                console.log("Usuário não autenticado.");
                btFavorito.style.display = "none";
        break;
        
        case 200:
            let dados = await response.json();
            if(dados["favorito"]){
                console.log("Item é favorito.");
                btFavorito.value = "Remover dos favoritos";
                //btFavorito.className += "btn-danger";
                btFavorito.className = btFavorito.className.replace("btn-success","btn-danger");
                ehFavorito = true;
            }else{
                console.log("Item não é favorito.");
                btFavorito.value = "Adicionar aos favoritos";
                //btFavorito.className += "btn-success";
                btFavorito.className = btFavorito.className.replace("btn-danger","btn-success");
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