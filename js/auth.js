let email = document.getElementById("emailEntrada");
let senhaEntrada = document.getElementById("senhaEntrada");
let btnEntrar = document.getElementById("btnEntrar");


btnEntrar.onclick = function(){
    login(email, senhaEntrada);
};

function login(email, senha){
    firebase.auth().signInWithEmailAndPassword(email.value, senha.value).then(function (user){
        console.log("acessou com sucesso");
        console.log(user);
        //sessionStorage.setItem("email", email.value);
        sessionStorage.setItem("senha", senha.value);
        console.log(user.user.email);
        sessionStorage.setItem("usuario", JSON.stringify(user.user.email));
        console.log(sessionStorage.getItem("usuario"))
        setTimeout(()=>{
            window.location.href = "../index.html";
        }, 500)
    }).catch(function (erro){
        console.error("falha ao logar");
        console.log(erro)
        if(erro.code == "auth/wrong-password"){
            alert("senha incorreta");
        }else if(erro.code == "auth/invalid-email"){
            alert("email com formato errado, digite da forma xxxxx@gmail.com");
        }else if(erro.code == "auth/user-not-found"){
            alert("email não encontrado")
        }
    })
};

console.log(sessionStorage.getItem("usuario"))