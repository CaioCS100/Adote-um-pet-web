$(function()
{
    isUserLogado();
    $('#nome').html(window.localStorage.getItem('nome'));

    $('#deslogar').click( function () {
        sair();
    });

    // $.ajax({
    //     url: "index.html",
    //     context: document.body
    //   }).done(function() {
    //     $('#nome').html(window.localStorage.getItem('usuario'));
    //   });
});