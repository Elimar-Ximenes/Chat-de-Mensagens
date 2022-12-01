let btn = document.getElementById("btn");
let email = document.getElementById("entradaEmail")
btn.onclick = ()=>{
    firebase.database().ref("usuarios").child("info").once('value').then(function (snapshot) {
        console.log(email.value);
        snapshot.forEach(element => {
            if(email.value == element.val().email){
                document.getElementById("divMostrarUser").innerHTML = element.val().nome;
                sessionStorage.setItem("email", element.val().email)
            }
        });
    })
}

