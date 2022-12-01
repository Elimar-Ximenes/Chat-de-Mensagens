async function chat(userDesti, ehGrupo) {
  let usuario = sessionStorage.getItem("usuario")
  let destinatario = userDesti;
  let imgPerfil = document.getElementById("imgPerfil");
 
  console.log(userDesti)

  let userName = document.getElementById("userName");

  userName.innerHTML = destinatario + '<br /><span id="userOnline">online</span>';

  //é grupo
  if(ehGrupo == true){
    firebase.database().ref("conversas").child("grupos").once('value').then(function (snapshot) {
      let integrantes = " "
      
      snapshot.forEach(element => {
        
          for (let index = 0; index < element.val().integrantes.length; index++) {
            
            if(element.val().integrantes[index] == usuario && element.val().nome == userDesti){
              //integrantes += '<span id="userOnline">'+ element.val().integrantes[index]+ '</span>';
              userName.innerHTML = userDesti;
              document.getElementById("imgDestinatario").src = element.val().img;
            }
            
          }
          //userName.innerHTML += '<br/>' + integrantes;
      });

  })
  }



  let carregarUsuario = new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        
        resolve(user);
        const dbRef = firebase.database().ref("usuarios");
        dbRef.child("info").once('value').then(function (snapshot) {
          //carrega imagem de perfil
          snapshot.forEach(element => {
            
            if (user.email == element.val().email) {
              imgPerfil.src = element.val().imgLink;
            }
          });

        })
      } else {
        reject(null);
      }
    });
  });
  carregarUsuario.then((data) => {
   
    usuario = data.email;
    
  }).catch((data) => {
    
  })
  setTimeout(() => {
    let user = firebase.auth().currentUser;


  }, 1000)

  let entradaMsg = document.getElementById("entradaMsg");
  let enviar = document.getElementById("enviarMsg");
  enviar.onclick = (() => {
    let data = new Date();
    criaMsg("message my_msg", entradaMsg.value, data.getMinutes() + ':' + data.getSeconds());
    salvarNoBanco(destinatario, usuario, entradaMsg, senha);
    setTimeout(() => {
      enviar.value = "";
      //entradaMsg.value = " ";
    }, 1000)
  });
  let senha;
  setTimeout(() => {
    procurarConversas(usuario, destinatario);
  }, 1500)
  function procurarConversas(usuario, destinatario) {

    let senha = "";

    let contador = 0;
    const dbRef = firebase.database().ref("conversas");
    console.log(userDesti)
    console.log(usuario)
    dbRef.child("individual").on('value',  function (snapshot) {

      document.getElementById("chatbox").innerHTML = "";
      
       snapshot.forEach( element => {
        //console.log(element.val().message)
        if (ehGrupo === true && element.val().grupo == userDesti) {
          if (element.val().emissor == usuario) {
            console.log(":)")
            criaMsg("message my_msg", element.val().message, element.val().hora);

          } else {
            criaMsg2("message friend_msg", element.val().emissor,element.val().message, element.val().hora);
          }
        } else if (ehGrupo === false) {
          if (
            (element.val().emissor == usuario &&
              element.val().destinatario == destinatario) ||
            (element.val().emissor == destinatario &&
              element.val().destinatario == usuario)
          ) {
            password = element.val().senha;
            console.log(element.val().message)
            if (element.val().emissor == usuario) {
              criaMsg("message my_msg", element.val().message, element.val().hora);
              console.log(element.val().message)
            } else if (element.val().emissor == destinatario) {
              criaMsg("message friend_msg", element.val().message, element.val().hora);
            } else if (element.val().destinatario == usuario) {
              criaMsg("message my_msg", element.val().message, element.val().hora);
            } else if (element.val().destinatario == destinatario) {
              criaMsg("message friend_msg", element.val().message, element.val().hora);
            }


          }
        }
      })
      
    });




  }



  function gerarSenhaAleatoria() {
    var stringAleatoria = "";
    var caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++) {
      stringAleatoria += caracteres.charAt(
        Math.floor(Math.random() * caracteres.length)
      );
    }
   
    return stringAleatoria;
  }

  function salvarNoBanco(destinatario, usuario, entrada, senha) {
    if (senha == "" || senha == undefined) {
      let promessa = new Promise((resolve, reject) => {
        const dbRef = firebase.database().ref("conversas");
        dbRef.child("individual").once('value').then(function (snapshot) {
          snapshot.forEach(element => {
            if (
              (element.val().emissor == usuario &&
                element.val().destinatario == destinatario) ||
              (element.val().emissor == destinatario &&
                element.val().destinatario == usuario)
            ) {
              senha = element.val().senha;
              resolve(senha);
            }
          });
          if (senha == "" || senha == undefined) {
            senha = gerarSenhaAleatoria();
            reject("")
          }
        })


      }
      )

      promessa.then((data) => {
       
        senha = data;
        
      })
    }
    
    if (senha == "" || senha == undefined) {
      senha = gerarSenhaAleatoria();

    }

    setTimeout(() => {
      var dataMsg = new Date();
      let data = {};
      if (ehGrupo == true) {
        data = {
          grupo: userDesti,
          emissor: usuario,
          message: entrada.value,
          dataMsg: dataMsg.getDate() + '/' + (dataMsg.getMonth() + 1) + '/' + dataMsg.getFullYear(),
          hora: dataMsg.getHours() + ':' + dataMsg.getMinutes(),
          senha: senha
        }
      } else {
        data = {
          destinatario: destinatario,
          emissor: usuario,
          message: entrada.value,
          dataMsg: dataMsg.getDate() + '/' + (dataMsg.getMonth() + 1) + '/' + dataMsg.getFullYear(),
          hora: dataMsg.getHours() + ':' + dataMsg.getMinutes(),
          senha: senha
        }
      }
      
       firebase.database().ref("conversas").child("individual").push(data).then(function () {
        console.log("adicionada com sucesso  \n a senha é igual a =" + senha)
      }).catch(function (error) {
        console.log('erro ', error)
      })
    }, 2000)
  }

  
    let vetorIds = [];
    let dbRef = firebase.database().ref("conversas");
    await dbRef.child("individual").once('value').then(function (snapshot) {
      snapshot.forEach(element => {
        if (
          (element.val().emissor == usuario &&
            element.val().destinatario == destinatario) ||
          (element.val().emissor == destinatario &&
            element.val().destinatario == usuario)
        ) {
          vetorIds.push(element.key);

        }

      });
      if (vetorIds.length) {
       
      } else {
       
      }
    })
  

  


  setTimeout(() => {
    firebase.database().ref('usuarios/info').once('value').then(function (snapshot) {

      let teste = snapshot.val();
      snapshot.forEach(element => {
       
        if (element.val().email == destinatario) {
          
          document.getElementById("imgDestinatario").src = element.val().imgLink;
          firebase.database().ref('status/' + element.val().uid).on('value', function (snapshot) {
            
            let userOnline = document.getElementById("userOnline");
            userOnline.innerHTML = "";
            userOnline.innerHTML = snapshot.val().state

          });

        }
      });

    })
    
  }, 3000)





}

if (sessionStorage.getItem("email") != undefined) {
  criarChat()
  chat(sessionStorage.getItem("email"), false);
} else {
  //chat("fd912735@gmail.com",false);
}

carregaBarraDeConversas();

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log(user)
    resolve(user);
    const dbRef = firebase.database().ref("usuarios");
    dbRef.child("info").once('value').then(function (snapshot) {
      //carrega imagem de perfil
      snapshot.forEach(element => {
        console.log()
        if (user.email == element.val().email) {
          chat(element.val().email,false)
        }
      });

    })
  }
});

function deslogar(){
  firebase.auth().signOut();
  window.location.href = "pages/login.html";
}



