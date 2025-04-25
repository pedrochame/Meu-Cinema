// Variáveis da página de perfil
let nomeUsuario = document.querySelector("#nomeUsuario");
let idUsuario = document.querySelector("#idUsuario");
let favoritosUsuario = document.querySelector("#favoritosUsuario");
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
    await favoritos();
    exibirPagina();
});

// Função que faz requsição ao back-end na rota de favoritos
async function favoritos(){

    let response = await fetch(rota_favoritos,{
        method:"GET",
        credentials:"include"
    });

    switch(response.status){
        case 401:
            redireciona(caminho_tela_login);
        break;
        
        case 200:
            let dados = await response.json();
            favoritosUsuario.textContent = dados["filme"].length + " filme(s) & " + dados["serie"].length + " série(s)";
        break;

        default:
            redireciona(caminho_tela_erro);
        break;

    }

}