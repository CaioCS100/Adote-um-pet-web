$(function(){
    var dados = [];

    firebase.auth().onAuthStateChanged(user => {
        firebase.database().ref('/pet').once('value').then(function(snapshot) {
            snapshot.forEach(snap => {   
                snap.forEach(pet => {
                    dados.push([pet.val().nome, pet.val().sexo, pet.val().genero, 
                        pet.val().estado, pet.val().cidade,
                        '<button type="button" data-id="'+pet.val().id+'"+ class="btn-visualizar btn btn-light">Visualizar</button>',
                        pet.val().id]);
                })
            })

            tablePet = $('#petTable').DataTable( {
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

    $('#petTable').on('click', 'button', function () {
        var idPet = tablePet.row($(this).parents('tr')).data()[6];
        window.location.href="visualizar-pet.html?id=" + idPet;
    });
});