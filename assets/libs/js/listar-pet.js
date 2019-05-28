$(function(){
    var dados = [];

    firebase.auth().onAuthStateChanged(user => {
        firebase.database().ref('/pet').once('value').then(function(snapshot) {
            snapshot.forEach(snap => {   
                snap.forEach(pet => {
                    dados.push([pet.val().nome, pet.val().sexo, pet.val().genero, 
                        pet.val().estado, pet.val().cidade,
                        '<button type="button" data-id="'+pet.nome+'" class="btn-visualizar btn btn-light">Visualizar</button>']);
                })
            })

            $('#petTable').DataTable( {
                data: dados,
                columns: [
                    { title: "Nome" },
                    { title: "Sexo"},
                    { title: "Genero"},
                    { title: "Estado"},
                    { title: "Cidade"},
                    { title: "Configurações"},
                ],
                language: getConfiguracaoTabela()
            });
        });
    });
});