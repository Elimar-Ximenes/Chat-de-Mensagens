let email = document.getElementById("emailCadastro");
let nome = document.getElementById("nomeCadastro");
let senha = document.getElementById("senhaCadastro");
let btnCadastrar = document.getElementById("btnCadastrar");
let fotoPerfil = document.getElementById("file")

let img;
let file = document.getElementById("file");
file.addEventListener('change', event => {
  img = event.target.files[0];
  console.log(img);
})
btnCadastrar.onclick = function () {
  firebase.auth().createUserWithEmailAndPassword(email.value, senha.value).then(function (result) {

    if (img.type.includes('image')) {
      console.log("é uma imagem");
      let nomeImagem = firebase.database().ref().push().key + '-' + img.name;
      let caminho = "usuarios /" + email.value + "/" + "perfil";

      let storage = firebase.storage().ref(caminho);
      let upload = storage.put(img);
      trackUpload(upload).then(function () {
        storage.getDownloadURL().then(function (URL) {
          var data = {
            imgLink: URL,
            nome: nome.value,
            email: email.value,
            uid: result.user.uid
          }
          firebase.database().ref("usuarios").child("info").push(data).then(function () {
            alert("usuario cadastrado com sucesso ");
            console.log(result.user)
          }).catch(function (error) {
            console.log('erro ', error)
          })
        })
      })
    }
    if (img.type.includes('audio')) {
      console.log("é um audio");
      let nomeImagem = firebase.database().ref().push().key + '-' + img.name;
      let caminho = "usuarios /" + email.value + "/" + img.name;

      let storage = firebase.storage().ref(caminho);
      let upload = storage.put(img);

    }


    return result.user.updateProfile({
      displayName: nome.value,
      photoURL: null
    })
  }).catch(function (error) {
    console.log(error);
    if (error.code == "auth/weak-password") {
      alert("digite uma senha")
    } else if (error.code == "auth/email-already-in-use") {
      alert("este email já esta em uso")


    } else if (error.code == "auth/invalid-email") {
      alert("email invalido, digite um email do tipo xxxxxx@email.com")
    }
    else {
      alert(error);
    }
  });

}
document.getElementById("irLogin").onclick = function () {
  window.location.href = "../pages/login.html"
}



// Rastreia o progresso de upload
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