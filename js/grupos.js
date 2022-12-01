/**let dataMsg = new Date();
let senha = "7IEYcg5n7vxlSecETSnc";

let data = {
    emissor: "edulene@gmail.com",
    message: "aaa",
    grupo: "teste",
    dataMsg: dataMsg.getDate() + '/' + (dataMsg.getMonth() + 1) + '/' + dataMsg.getFullYear(),
    hora: dataMsg.getHours() + ':' + dataMsg.getMinutes(),
    senha: senha
}
firebase.database().ref("conversas").child("individual").push(data).then(function () {
  console.log("adicionada com sucesso  \n a senha é igual a =" + senha)
}).catch(function (error) {
  
}) **/
/** 
let integrantes = ["franciscodaschagas823@gmail.com", "ronaldo@gmail.com", "fd912735@gmail.com"] 
let data = {
    integrantes: integrantes,
    nome: "teste2",
    admin: "franciscodaschagas823@gmail.com"
}
firebase.database().ref("conversas").child("grupos").push(data).then(function () {
    console.log("adicionada com sucesso  \n a senha é igual a =" + senha)
  }).catch(function (error) {
    
  })*/
/** 
  firebase.database().ref("conversas").child("grupos").once('value').then(function (snapshot) {
    
    snapshot.forEach(element => {
        console.log(element.val().integrantes[2])
    });
})*/
let img;
let file = document.getElementById("imgGrupo");
file.addEventListener("change", event=>{
  console.log(event.target.files)
  img = event.target.files[0];
  console.log(img);
})
async function carregarUsuarios() {
  let usuario = JSON.parse(sessionStorage.getItem("usuario"));
console.log(usuario)
if(usuario == null){
  await firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.email)
      usuario = user.email
    }
  });
}
let vetor = []  
let check = document.getElementById("check");
await firebase.database().ref("conversas").child("individual").once('value').then(function (snapshot) {
    
  snapshot.forEach(element => {
   
      if(element.val().emissor == usuario && element.val().destinatario != undefined){
        vetor.push(element.val().destinatario)
      }
  });
})
console.log(vetor);
vetor = [...new Set(vetor)];
console.log(vetor);
let vetorUsuarios = [];

//imagem grupo


let nomeGrupo = document.getElementById("nomeGrupo");
vetor.forEach(element => {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.width = 'auto'
    checkbox.style.backgroundColor = 'red'
    let label = document.createElement("p");
    label.innerHTML = element

    let div = document.createElement('div');
    div.style.display = "flex";
    div.style.justifyContent = "left"

    div.append(checkbox);
    div.append(label);
    
    check.append(div)

    check.append(document.createElement('n'))  
    console.log(checkbox.checked)
      checkbox.onclick = ()=>{
        if(checkbox.checked){
          console.log("clicou")
          vetorUsuarios.push(element)
          console.log(vetorUsuarios)
        }
      }
    
});

document.getElementById("btn").onclick = ()=>{
  vetorUsuarios.push(usuario)
  

if (img.type.includes('image')) {
  console.log("é uma imagem");
  //let nomeImagem = firebase.database().ref().push().key + '-' + img.name;
  let caminho = "grupos /"+nomeGrupo.value;

  let storage = firebase.storage().ref(caminho);
  let upload = storage.put(img);
  trackUpload(upload).then(function () {
    storage.getDownloadURL().then(function (URL) {
      let data = {
        integrantes: vetorUsuarios,
        nome: nomeGrupo.value,
        admin: usuario,
        img: URL
    }
      firebase.database().ref("conversas").child("grupos").push(data).then(function () {
        //console.log("adicionada com sucesso  \n a senha é igual a =" + senha);
        alert("grupo criado com sucesso")
      }).catch(function (error) {
        alert(error);
      })
    })
  })
}




  
}
}

function trackUpload(upload) {
  return new Promise(function (resolve, reject) {

    upload.on('state_changed',
      function (snapshot) { // Segundo argumento: Recebe informações sobre o upload
        console.log((snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(2) + '%')
        progress.value = snapshot.bytesTransferred / snapshot.totalBytes * 100
      }, function (error) { // Terceiro argumento: Função executada em caso de erro no upload
        reject(error)
      },
      function () { // Quarto argumento: Função executada em caso de sucesso no upload
        console.log('Sucesso no upload')
        resolve()
      })


  })
}

carregarUsuarios();