$(function(){
    EnableAndDisableInputs(true);
    var brasil = getBrasil();
    var idUsuario;
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                            .exec(window.location.search);
    
        return (results !== null) ? results[1] || 0 : false;
    }
    var idPet = $.urlParam('id');
    
    firebase.auth().onAuthStateChanged(user =>{
        idUsuario = user.uid;
        firebase.database().ref('/pet').once('value').then(function(snapshot) {
            snapshot.forEach(snapshot1 => {
                snapshot1.forEach(snap => {
                    if(snap.val().id === idPet)
                    {
                        $('#nomePet').val(snap.val().nome);
                        snap.val().nome === 'Cachorro' ? $('#cachorro').prop("checked", true) : $('#gato').prop("checked", true);
                        snap.val().sexo === 'M' ? $('#masculino').prop("checked", true) : $('#feminino').prop("checked", true);
                        $('#idades').val(snap.val().idade);
                        $('#telefone').val(snap.val().telefone);
                        $('#estados').val(snap.val().estado);
                        getCidade(snap.val().estado);
                        $('#cidades').val(snap.val().cidade);
                        putImages(snap.val().pathImages, snap.val().id)
                    }
                });
            });
        })
    });

    $('#voltar').click(function (evt){
        console.log('aqui');
        
        window.location.href="listar-pet.html";
    });



    function putImages(imgs, id)
    {
        console.log(imgs);
        
        for (let index = 0; index < imgs.length; index++) 
        {
            firebase.storage().ref('pets').child(id).child(imgs[index]).getDownloadURL().then(url => {
                $("#img"+index).attr("src", url);
                $("#img"+index).attr("alt", imgs[index].nome);
                $("#img"+index).attr("height", "250px");
                $("#img"+index).attr("width", "250px");
                $("#div"+index).removeClass("centralizar");
                $("#img"+index).addClass("d-block w-100");
            }).catch(erro => {
                console.log(erro);
            });
        }
        $('#slide').carousel(0);
    }

    function getCidade(estadoSelecionado)
    {
        brasil.map(function(estado) {
            if(estadoSelecionado == estado.sigla)
            {
              zerarCidades();
              estado.cidades.map(function(cidade) {
                $("#cidades").append(new Option(cidade, cidade, false, false));
             });
            }
          });
    }

    function zerarCidades()
    {
      $("#cidades option").remove();
      $("#cidades").append(new Option('Selecione uma Cidade', 'none', true, true));
    }

    function EnableAndDisableInputs(value)
    {
        $('#nomePet').attr('disabled', value);
        $('#cachorro').attr('disabled', value);
        $('#gato').attr('disabled', value);
        $('#masculino').attr('disabled', value);
        $('#feminino').attr('disabled', value);
        $('#idades').attr('disabled', value);
        $('#telefone').attr('disabled', value);
        $('#estados').attr('disabled', value);
        $('#cidades').attr('disabled', value);
        $('#files').attr('disabled', value);
    }
});