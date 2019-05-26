$(function() {
    $("#telefone").inputmask("(99) 99999-9999");

    var imgs = [];
    var img = {nome: '', arquivo: '', hasImg: false};
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
        genero: $("input[name='tipoPet']:checked").val(),
        id: '',
        idade: $("#idades").val(),
        nome: $("#nomePet").val(),
        pathImages: [],
        sexo: $("input[name='genero']:checked").val(),
        telefone: $("#telefone").val(),
      };

      imgs.forEach(function (img){
        pet.pathImages.push(img.nome)
      });

      var db = firebase.database().ref('pet').child(idUser);

      let uid = db.push().key;
      pet.id = uid;

      db.child(uid).set(pet, function (error) {
        if(!error)
          console.log('Cadastrado com sucesso!');
      });

      var storage = firebase.storage().ref('pets').child(idUser);
      
      for (let i = 0; i < pet.pathImages.length; i++) {
        var imagesRef = storage.child(imgs[i].nome);

        imagesRef.putString(imgs[i].arquivo).then(function(snapshot) {
          console.log('Uploaded a blob or file!');
        });
      }
    });

    brasil.map(function(estado) {
      $("#estados").append(new Option(estado.nome, estado.sigla, false, false));
    });

    $("#estados").change(function (evt) {
      zerarCidades();
      $("#cidades")
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
              img = {
                  nome: escape(theFile.name),
                  arquivo: e.target.result,
                  hasImg: true
              };
              imgs.push(img);
            
              for (let index = 0; index < imgs.length; index++) 
              {
                $("#img"+index).attr("src", imgs[index].arquivo);
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

    function zerarCidades()
    {
      $("#cidades option").remove();
      var newOpction = $(document.createElement('option'));
      newOpction.before().html(`<option value="none" selected>Selecione uma Cidade</option>`);
      newOpction.appendTo("#cidades");
      
    }
});