let nomeUsuario = document.querySelector("#nomeUsuario");
let senhaUsuario = document.querySelector("#senhaUsuario");
let btLogout = document.querySelector("#btLogout");

async function logout(){
            let response = await fetch("http://127.0.0.1:5000/logout",{
                method:"GET",
                credentials:"include"
            });
            if(response.status == 200){
                window.location = "login.html";
            }
        }


        btLogout.addEventListener("click", async ()=>{
            await logout();
        })

        document.addEventListener("DOMContentLoaded", async () => {
    await buscaUsuario();
 });

 async function buscaUsuario(){
    let response = await fetch("http://127.0.0.1:5000/usuario",{
        method:"GET",
        credentials:"include"
    });

    let dados = await response.json();

    if(response.status==200){
        nomeUsuario.textContent = dados["Nome"];
        idUsuario.textContent = dados["ID"];
    }else{
        window.location = "login.html";
    }
}
