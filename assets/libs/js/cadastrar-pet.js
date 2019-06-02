$(function() {
  $("#telefone").inputmask("(99) 99999-9999");

  var imgs = [];
  var brasil = getBrasil();
  var today = new Date();

  $("#cadastrar").click(function (evt) {
    evt.preventDefault();
    var idUser = firebase.auth().currentUser.uid;
    var pet = {
      adotado: false,
      cidade: $("#cidades").val(),
      data_envio: today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(),
      estado: $("#estados").val(),
      genero: $("input[name='genero']:checked").val(),
      id: '',
      idade: $("#idades").val(),
      nome: $("#nomePet").val(),
      pathImages: [],
      sexo: $("input[name='sexo']:checked").val(),
      telefone: $("#telefone").val(),
    };

    imgs.forEach(function (img){
      pet.pathImages.push(img.nome)
    });

    if(validarPet(pet, 0))
    {
      var db = firebase.database().ref('pet').child(idUser);

      let uid = db.push().key;
      pet.id = uid;

      db.child(uid).set(pet, function (error) {
        if(error)
          console.log(error);
      }).then(doc => {
        var storage = firebase.storage().ref('pets').child(pet.id);
        var promises = [];

        for (let i = 0; i < pet.pathImages.length; i++) 
        {
          var imagesRef = storage.child(imgs[i].nome);
          
          promises.push(imagesRef.putString(imgs[i].url, 'data_url'));
        }

        Promise.all(promises).then(() => {
          $("#alert").removeClass("esconder");
          $( "#nomePet" ).focus();
          limparCampos();
        });
        
      });
    }
  });

  brasil.map(function(estado) {
    $("#estados").append(new Option(estado.nome, estado.sigla, false, false));
  });

  $("#estados").change(function (evt) {
    zerarCidades();
    brasil.map(function(cidades) {
      if($("#estados").val() == cidades.sigla)
      {
        zerarCidades();
        cidades.cidades.map(function(cidade) {
          $("#cidades").append(new Option(cidade, cidade, false, false));
       });
      }
    });
  });

  $("#files").change(function (evt) {
      var files = evt.target.files;
  
      for (var i = 0, f; f = files[i]; i++) 
      {
        if (!f.type.match('image.*'))
          continue;
        
        var reader = new FileReader();

        reader.onload = (function(theFile) {
          return function(e) {
            var img = {
              nome: escape(theFile.name),
              url: e.target.result,
              hasImg: true
            };
    
            imgs.push(img);

            for (let index = 0; index < imgs.length; index++) 
            {
              $("#img"+index).attr("src", imgs[index].url);
              $("#img"+index).attr("alt", imgs[index].nome);
              $("#img"+index).attr("height", "250px");
              $("#img"+index).attr("width", "250px");
              $("#div"+index).removeClass("centralizar");
              $("#img"+index).addClass("d-block w-100");
            }
          };
        })(f);
        reader.readAsDataURL(f);
        $('#slide').carousel(0);
      }
  });

  $("#limparImgs").click(function (evt) {
    imgs = [];
    fotos = [];
    resetImages();
  });

  function resetImages()
  {
    var legenda = ['Primeira Imagem', 'Segunda Imagem', 'Terceira Imagem', 'Quarta Imagem', 'Quinta Imagem']
    for (let index = 0; index < 5; index++) 
    {
      $("#img"+index).attr("src", '../assets/icons/baseline_image_search_black_48dp.png');
      $("#img"+index).attr("alt", legenda[index]);
      $("#img"+index).attr("height", "100px");
      $("#img"+index).attr("width", "100px");
      $("#img"+index).removeClass("d-block w-100");
      $("#div"+index).addClass("centralizar");
    }
  }

  function limparCampos()
  {
    $('#formulario').trigger("reset");
    // document.querySelector('form').reset();
    resetImages();
  }

  function zerarCidades()
  {
    $("#cidades option").remove();
    $("#cidades").append(new Option('Selecione uma Cidade', 'none', true, true));
  }
});