let img = document.getElementById("img");

let fotoPerfil = document.getElementById("file")
let email;
console.log(firebase.auth().currentUser)
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    console.log(user.email)
    email = await user.email;
    const dbRef = firebase.database().ref("usuarios");
    dbRef.child("info").once('value').then(function (snapshot) {
      //carrega imagem de perfil
      snapshot.forEach(element => {
        //console.log(element.val())
        if (user.email == element.val().email) {
          img.src = element.val().imgLink;

        }
      });

    })
  }
});
let imagem;
let file = document.getElementById("file");
file.addEventListener('change', event => {
  imagem = event.target.files[0];
  console.log(imagem);
})

document.getElementById("btnALterar").onclick = () => {
  if (imagem.type.includes('image')) {
    console.log("é uma imagem");
    let nomeImagem = firebase.database().ref().push().key + '-' + imagem.name;
    let caminho = "usuarios /" + email + "/" + "perfil";

    let storage = firebase.storage().ref(caminho);
    let upload = storage.put(imagem);
    trackUpload(upload).then(function () {
      storage.getDownloadURL().then(function (URL) {
        var data = {
          imgLink: URL,
        }
        firebase.database().ref("usuarios").child("info").once('value', function (snapshot) {
          let key;
          snapshot.forEach(element => {
            if (element.val().email == email) {
              console.log(element.key)
              key = element.key
            }
          });
          firebase.database().ref("usuarios/info").child(key)
          .update(data).then(function () {
            console.log(key)
            alert('foto de perfil alterada com sucesso')
          }).catch(function (erro) {
            alert(erro)
          });
        })
        
      })
    })
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

