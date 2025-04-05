async function buscaUsuario(){
    let response = await fetch("http://127.0.0.1:5000/usuario",{
        method:"GET",
        credentials:"include"
    });
    if(response.status==200){
        window.location = "perfil.html";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await buscaUsuario();
 });


 let btLogin = document.querySelector("#btLogin");
 let nomeUsuario = document.querySelector("#nomeUsuario");
 let senhaUsuario = document.querySelector("#senhaUsuario");
 let info = document.querySelector("#info");

 async function login(nomeUsuario,senhaUsuario){
     let response = await fetch("http://127.0.0.1:5000/login",{
         method: "POST",
         credentials:"include",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ 
             nome : nomeUsuario,
             senha : senhaUsuario,
             })
     });

     let dados = await response.json();
     console.log(dados);

     if(response.status!=200){
         info.textContent = dados["Mensagem"];
     }else{
         window.location = "perfil.html";
     }

 }


 btLogin.addEventListener("click",async ()=>{
     if (nomeUsuario.value=="" || senhaUsuario.value==""){
         info.textContent = "Os campos são obrigatórios!"
         return;
     }
     if(window.location.pathname.split("/").pop() == "login.html"){
        await login(nomeUsuario.value,senhaUsuario.value);
     }
     if(window.location.pathname.split("/").pop() == "cadastro.html"){
        await cadastro(nomeUsuario.value,senhaUsuario.value);
     }
 });


 document.querySelectorAll(".campo").forEach(e => {
     e.addEventListener("focus", ()=>{
         info.textContent = "";
     });
 });


 async function cadastro(nomeUsuario,senhaUsuario){

    let response = await fetch("http://127.0.0.1:5000/cadastro",{
        method: "POST",
        credentials:"include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            nome : nomeUsuario,
            senha : senhaUsuario,
            })
    });


   
    let dados = await response.json();
    console.log(dados); 

    if(response.status==201){
        window.location = "login.html";
    }else{
        info.textContent = dados["Mensagem"];
    }
    


}