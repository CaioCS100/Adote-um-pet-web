$(function()
{
    isUserLogado();
    $('#nome').html(window.localStorage.getItem('nome'));

    $('#deslogar').click( function () {
        sair();
    });
});