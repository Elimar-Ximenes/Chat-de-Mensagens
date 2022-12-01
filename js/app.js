var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function criaMsg2(classe, emissor, msg, hora) {
  //window.scroll({top:-1000})
  document.getElementById("chatbox").scroll({ top: 6000 })
  let chatbox = document.getElementById("chatbox");


  let divMsg = document.createElement("div");
  divMsg.className = classe;
  chatbox.append(divMsg);

  let nomeEmissor = document.createElement("p");
  nomeEmissor.appendChild(document.createTextNode(emissor))

  let texto = document.createElement("p");
  texto.appendChild(document.createTextNode(msg))

  let horario = document.createElement("span");
  horario.innerHTML = hora;

  nomeEmissor.appendChild(texto);
  texto.appendChild(horario);
  divMsg.appendChild(nomeEmissor);
  let br = document.createElement("br");
  texto.append(br);
}
function criaMsg(classe, msg, hora) {
  //window.scroll({top:-1000})
  document.getElementById("chatbox").scroll({top:6000})
  let chatbox = document.getElementById("chatbox");

  let divMsg = document.createElement("div");
  divMsg.className = classe;
  chatbox.append(divMsg);
  let texto = document.createElement("p");
  texto.appendChild(document.createTextNode(msg))
  let horario = document.createElement("span");
  horario.innerHTML = hora;
  texto.appendChild(horario);
  divMsg.appendChild(texto);
  let br = document.createElement("br");
  texto.append(br);
}
//criaMsg("message my_msg", "oi");
//criaMsg("message friend_msg", "oi, tchau");

function mensagens(usuario, destinatario, senha) {
  console.log("carrega mensagens");
  const dbRef = firebase.database().ref("conversas");
  dbRef.child("individual").once('value').then(function (snapshot) {
    document.getElementById("")
    snapshot.forEach(element => {
      if (senha == element.val().senha) {
        if (element.val().emissor == usuario) {
          criaMsg("message my_msg", element.val().message);

        } else if (element.val().emissor == destinatario) {
          criaMsg("message friend_msg", element.val().message);
        } else if (element.val().destinatario == usuario) {
          criaMsg("message my_msg", element.val().message);
        } else if (element.val().destinatario == destinatario) {
          criaMsg("message friend_msg", element.val().message);
        }

      }
    });


  })

}

function removerElementos() {
  var e = document.querySelector("chatbox");

  //e.firstElementChild can be used.
  var child = e.lastElementChild;
  while (child) {
    e.removeChild(child);
    child = e.lastElementChild;
  }
}
function criarChat(){

  let inicial = document.getElementById("inicial").style.display = "none";
  let chatbox = document.getElementById("chatbox").style.removeProperty('display');
  let chatInput= document.getElementById("chat_input").style.removeProperty('display');
  
}
async function conversasRecentes(fotoPerfil, userName, tempo, mensagem, ehGrupo) {
  let chatList = document.getElementById("chatList");
  let block = document.createElement("div");
  block.className = "block";
  block.id = "barraconversa"
  chatList.append(block);
  block.addEventListener("click", () => {
    criarChat()
    sessionStorage.setItem("email", userName)
    if (ehGrupo == true) {
      chat(userName, true);
    } else {
      chat(userName, false);
    }
  })
  //é um grupo ;)
  if (ehGrupo == true) {
    firebase.database().ref("conversas").child("grupos").once('value').then(function (snapshot) {

      snapshot.forEach(element => {

        console.log("user name = " + userName)
        if (element.val().nome == userName) {
          console.log("entrou na condição")
          let imgBox = document.createElement("div");
          imgBox.className = "imgBox";
          block.append(imgBox);
          let img = document.createElement("img");
          img.className = "cover";
          img.src = element.val().img;
          imgBox.append(img);


          let details = document.createElement("div");
          details.className = "details";
          block.append(details);

          let listHead = document.createElement("listHead");
          listHead.className = "listHead";
          details.append(listHead);
          let nome = document.createElement("h4");
          nome.innerHTML = element.val().nome;
          listHead.append(nome);
          let time = document.createElement("p");
          time.className = "time";
          time.innerHTML = tempo;
          listHead.append(tempo);

          let message_p = document.createElement("div");
          message_p.className = "message_p";
          details.append(message_p);

          let p = document.createElement("p");
          p.innerHTML = mensagem;
          message_p.append(p);
        }
      });
    })
  } else if (ehGrupo == false) {
    await firebase.database().ref("usuarios/info").once('value').then(function (snapshot) {
      snapshot.forEach(element => {
        //console.log(element.val().email)
        if (element.val().email == userName) {
          let imgBox = document.createElement("div");
          imgBox.className = "imgBox";
          block.append(imgBox);
          let img = document.createElement("img");
          img.className = "cover";
          img.src = element.val().imgLink;
          imgBox.append(img);
          console.log(snapshot.val().imgLink);

          let details = document.createElement("div");
          details.className = "details";
          block.append(details);

          let listHead = document.createElement("listHead");
          listHead.className = "listHead";
          details.append(listHead);
          let nome = document.createElement("h4");
          nome.innerHTML = element.val().nome;
          listHead.append(nome);
          let time = document.createElement("p");
          time.className = "time";
          time.innerHTML = tempo;
          listHead.append(tempo);

          let message_p = document.createElement("div");
          message_p.className = "message_p";
          details.append(message_p);

          let p = document.createElement("p");
          p.innerHTML = mensagem;
          message_p.append(p);
        }
      });
    });
  }



  //nome, mensagem e data

}