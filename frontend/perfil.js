// Variáveis da página de perfil
let nomeUsuario = document.querySelector("#nomeUsuario");
let idUsuario = document.querySelector("#idUsuario");
let btLogout = document.querySelector("#btLogout");

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

// Se o botão de Logout for clicado, a função responsável é chamada
btLogout.addEventListener("click", async ()=>{
    await logout();
});

// Assim que a página estiver pronta, é verificado se o usuário está logado.
// Se estiver, seus dados são exibidos na página. Se não, redirecionamos para a tela de login.
document.addEventListener("DOMContentLoaded", async () => {
    let usuario = await buscaUsuario();
    if(usuario != null){
        nomeUsuario.textContent = usuario["Nome"];
        idUsuario.textContent = usuario["ID"];
    }else{
        redireciona(caminho_tela_login);
    }
    exibirPagina();
});