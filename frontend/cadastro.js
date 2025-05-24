// Variáveis da tela de Cadastro
let btCadastro = document.querySelector("#btCadastro");
let nomeUsuario = document.querySelector("#nomeUsuario");
let senhaUsuario = document.querySelector("#senhaUsuario");
let info = document.querySelector("#info");

// Função que faz requisição ao back-end, na rota de Cadastro de usuário
async function cadastro(nomeUsuario,senhaUsuario){
    let response = await fetch(rota_cadastro,{
        method: "POST",
        credentials:"include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            nome : nomeUsuario,
            senha : senhaUsuario,
            })
        });
    
    // Se a resposta for positiva (status 201, criação com sucesso), o usuário é redirecionado para a tela de login 
    if(response.status == 201){
        window.location = "login.html";
    }else{
        // Se não, a mensagem retornada pelo back-end é exibida na tela
        let dados = await response.json();
        info.textContent = dados["Mensagem"];
    }
    
}

// Quando o botão de cadastro é clicado, os campos são verificados e a função de cadastro é chamada
btCadastro.addEventListener("click", async ()=>{
    if(nomeUsuario.value == "" || senhaUsuario.value == ""){
        info.textContent = "Os campos são obrigatórios!"
        return;
    }
    await cadastro(nomeUsuario.value,senhaUsuario.value);
});

// Quando algum campo for focado, a mensagem de informação deixa de ser exibida
document.querySelectorAll(".campo").forEach(e => {
    e.addEventListener("focus", ()=>{
        info.textContent = "";
    });
});

// Assim que a página estiver pronta, é verificado se o usuário está logado.
// Se estiver, redirecionamos para a tela de perfil.
document.addEventListener("DOMContentLoaded", async () => {
    esconderPagina();
    let usuario = await buscaUsuario();
    if(usuario != null){
        window.location = "perfil.html";
    }
    exibirPagina();
});