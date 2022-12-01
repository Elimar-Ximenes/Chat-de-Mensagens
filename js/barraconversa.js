async function carregaBarraDeConversas() {


  let usuario;
  let carregarUsuario = new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        resolve(user);
        const dbRef = firebase.database().ref("usuarios");
        dbRef.child(firebase.auth().currentUser.uid).once('value').then(function (snapshot) {
          snapshot.forEach(element => {


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
    window.location.href = "pages/login.html"
  });
  let vetorGrupos = []
  firebase.database().ref("conversas").child("grupos").once('value').then(function (snapshot) {

    snapshot.forEach(element => {
      for (let index = 0; index < element.val().integrantes.length; index++) {

        if (element.val().integrantes[index] == usuario) {

          vetorGrupos.push(element.val())

        }

      }
    });
  })
  let vetor = [];

  const dbRef = firebase.database().ref("conversas");


  await dbRef.child("individual").once('value').then(function (snapshot) {


    snapshot.forEach(element => {
      if (
        (element.val().emissor == usuario && element.val().grupo == undefined) ||
        (
          element.val().destinatario == usuario && element.val().grupo == undefined)
      ) {
        vetor.push(element.val())
        password = element.val().senha;
        /** 
        if (element.val().emissor == usuario) {
          conversasRecentes(null, element.val().destinatario, null, null);
          
        } else {
          conversasRecentes(null, element.val().emissor, null, null);
        } */


      }
    })
  });
  //lógica para deicar apenas como se tivesse uma conversa com cada pessoa
  setTimeout(() => {

    vetor = [...new Set(vetor)];

    for (let i = 0; i < vetor.length; i++) {
      for (let j = 0; j < vetor.length; j++) {

        if (vetor[i].senha == vetor[j].senha && i != j) {

          vetor[j] = 0
        }
        if (vetor[j] != 0) {

        }
      }

    }
    console.log(vetorGrupos)
    console.log(vetor)
    for (let index = 0; index < vetor.length; index++) {
      if (vetor[index] != 0) {


        if (vetor[index].emissor == usuario) {
          conversasRecentes(null, vetor[index].destinatario, vetor[index].dataMsg, vetor[index].message, false);

        } else {
          conversasRecentes(null, vetor[index].emissor, vetor[index].dataMsg, vetor[index].message, false);
        }



      }

    }
    for (let index = 0; index < vetorGrupos.length; index++) {
      if (vetorGrupos[index].admin != undefined) {

        conversasRecentes(null, vetorGrupos[index].nome, "2022-02-02", "ola", true);
      }

    }


  }, 100)




}