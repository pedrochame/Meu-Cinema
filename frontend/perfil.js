// Variáveis da página de perfil
let nomeUsuario = document.querySelector("#nomeUsuario");
let idUsuario = document.querySelector("#idUsuario");
let emailUsuario = document.querySelector("#emailUsuario");
let btLogout = document.querySelector("#btLogout");

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
        emailUsuario.textContent = usuario["Email"];
    }else{
        redireciona(caminho_tela_login);
    }
    esconderPagina(usuario);
    
    // 21.02.26 - Por enquanto, não exibir contagem de favoritos
    //await favoritos();
    
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
            exibirErro();
        break;

    }

}