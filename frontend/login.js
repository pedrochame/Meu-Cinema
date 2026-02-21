// Variáveis da tela de Login
let btLogin = document.querySelector("#btLogin");
let nomeUsuario = document.querySelector("#nomeUsuario");
let senhaUsuario = document.querySelector("#senhaUsuario");
let info = document.querySelector("#info");

// Função que faz requisição ao back-end, na rota de Login de usuário
async function login(nomeUsuario,senhaUsuario){
    let response = await fetch(rota_login,{
        method: "POST",
        credentials:"include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            nome : nomeUsuario,
            senha : senhaUsuario,
        })
    });

    // Se a resposta for positiva (status 200), o usuário é redirecionado para a tela de perfil
    if(response.status == 200){
        //window.location = "perfil.html";
        window.location = "index.html";
    }else{
        // Se não, a mensagem retornada pelo Back-End será exibida na tela
        let dados = await response.json();
        
        info.textContent = dados["Mensagem"];
    }

}

// Quando o botão de login é clicado, os campos são verificados e a função de cadastro é chamada
btLogin.addEventListener("click", async ()=>{
    if(nomeUsuario.value == "" || senhaUsuario.value == ""){
        info.textContent = "Os campos são obrigatórios!"
        return;
    }
    await login(nomeUsuario.value,senhaUsuario.value);
});

// Assim que a página estiver pronta, é verificado se o usuário está logado.
// Se estiver, redirecionamos para a tela de perfil.
document.addEventListener("DOMContentLoaded", async () => {
    
    let usuario = await buscaUsuario();
    if(usuario != null){
        redireciona(caminho_tela_perfil);
    }
    esconderPagina(usuario);

    // Ao clicar no link da página de cadastro, redirecionar
    document.querySelector("#linkCadastro").addEventListener("click",()=>{
        redireciona(caminho_tela_cadastro);
    });


    exibirPagina();
});

// Quando algum campo for focado, a mensagem de informação deixa de ser exibida
document.querySelectorAll(".campo").forEach(e => {
    e.addEventListener("focus", ()=>{
        info.textContent="";
    });
});