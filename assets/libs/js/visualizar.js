$(function(){
    EnableAndDisableInputs(true);
    $("#telefone").inputmask("(99) 99999-9999");
    var brasil = getBrasil();
    var nameImagesFirebase = [];
    var imgs = [];
    var chave;
    var idUsuario;
    var fotos = [];
    var countImages = 0;

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.search);
    
        return (results !== null) ? results[1] || 0 : false;
    }
    var idPet = $.urlParam('id');
    
    firebase.auth().onAuthStateChanged(user =>{
        firebase.database().ref('/pet').once('value').then(function(snapshot) {
            snapshot.forEach(snapshot1 => {
              //Aqui eu verifico se o primeiro valor do snapshot1 é igual ao valor que vem da URL
              //Se for igual eu guardo a key do snapshot1 (que seria a chave para poder editar o usuario)
                var valores = [];
                valores = Object.keys(snapshot1.val());
                valores.map(function (valor) {
                  if (valor == idPet)
                    return chave = snapshot1.key;
                });
                snapshot1.forEach(snap => {
                    if(snap.val().id === idPet)
                    {
                        idUsuario = snap.val().id;
                        $('#nomePet').val(snap.val().nome);
                        snap.val().nome === 'Cachorro' ? $('#cachorro').prop("checked", true) : $('#gato').prop("checked", true);
                        snap.val().sexo === 'M' ? $('#masculino').prop("checked", true) : $('#feminino').prop("checked", true);
                        $('#idades').val(snap.val().idade);
                        $('#telefone').val(snap.val().telefone);
                        $('#estados').val(snap.val().estado);
                        getCidade(snap.val().estado);
                        $('#cidades').val(snap.val().cidade);
                        putImages(snap.val().pathImages, snap.val().id);
                    }
                });
            });
        })
    });

    $('#editar').click(function(evt) {
      evt.preventDefault();
      var pet = {
        adotado: false,
        cidade: $("#cidades").val(),
        estado: $("#estados").val(),
        genero: $("input[name='genero']:checked").val(),
        id: idUsuario,
        idade: $("#idades").val(),
        nome: $("#nomePet").val(),
        pathImages: [],
        sexo: $("input[name='sexo']:checked").val(),
        telefone: $("#telefone").val(),
      };
       
      nameImagesFirebase.forEach(function (img) {
        pet.pathImages.push(img);
      });

      imgs.forEach(function (img){
        pet.pathImages.push(img.nome);
      });

      if(validarPet(pet, countImages))
      {
        var db = firebase.database().ref('pet').child(chave);
  
        db.child(pet.id).set(pet, function (error) {
          if(error)
            console.log(error);
        }).then(doc => {
          
          var storage = firebase.storage().ref('pets').child(pet.id);
          var promises = [];
  
          for (let i = 0; i < pet.pathImages.length - countImages; i++) 
          {
            var imagesRef = storage.child(imgs[i].nome);
            
            promises.push(imagesRef.put(imgs[i].arquivo));
          }
  
          Promise.all(promises).then(() => {
            //retornar para a pagina de procura e colocar um aviso de editado com sucesso
            //verificar se existe algum bug na hora que edito o estado, 
            //verificar se as cidades vem certo
            //colocar o botao de apagar imgs
            console.log('feito');
          });
          
        });
      }
    })

    $('#voltar').click(function(evt) {
        window.location.href="listar-pet.html";
    });

    $('#btnEditar').click(function(evt) {
        $("#editar").removeClass("esconder");
        $("#btnEditar").addClass("esconder");
        EnableAndDisableInputs(false);
    });

    brasil.map(function(estado) {
        $("#estados").append(new Option(estado.nome, estado.sigla, false, false));
      });

    $("#files").change(function (evt) {
        var files = evt.target.files;
        
        if (countImages + fotos.length + files.length > 5)
        {
          $('#imgObr').text('O valor maximo permitido são de 5 imagens.')
          return $('#imgObr').removeClass('esconder');
        }
        else 
        {
          $('#imgObr').text('Selecione Pelo menos 3 fotos')
          $('#imgObr').addClass('esconder');
        }
    
        for (var i = 0, f; f = files[i]; i++) 
        {
          if (!f.type.match('image.*'))
            continue;
  
          var img = {
            nome: f.name,
            arquivo: f, 
            hasImg: true
          };
  
          imgs.push(img);
          
          var reader = new FileReader();
  
          reader.onload = (function(theFile) {
            return function(e) {
              fotos.push(e.target.result);
              for (let index = 0; index < imgs.length; index++) 
              {
                $("#img"+(countImages + index)).attr("src", fotos[index]);
                $("#img"+(countImages + index)).attr("alt", imgs[index].nome);
                $("#img"+(countImages + index)).attr("height", "250px");
                $("#img"+(countImages + index)).attr("width", "250px");
                $("#div"+(countImages + index)).removeClass("centralizar");
                $("#img"+(countImages + index)).addClass("d-block w-100");
              }
            };
          })(f);
          reader.readAsDataURL(f);
          $('#slide').carousel(0);
        }
    });

    function putImages(imgs, id)
    {
      countImages = imgs.length;
      
      for (let index = 0; index < countImages; index++) 
      {
          nameImagesFirebase.push(imgs[index]);
          firebase.storage().ref('pets').child(id).child(imgs[index]).getDownloadURL().then(url => {
              $("#img"+index).attr("src", url);
              $("#img"+index).attr("alt", imgs[index]);
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