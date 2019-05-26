$(function () {
    $('#login').click( function (event) {
        event.preventDefault();
        firebase.auth().signInWithEmailAndPassword($('#username').val(), $('#password').val()).then(function(result){
            window.localStorage.setItem('nome', firebase.auth().currentUser.displayName);
            window.localStorage.setItem('usuario', firebase.auth().currentUser);
            window.location.href = '../index.html';
        }).catch(function(error) {
            // var errorCode = error.code;
            // var errorMessage = error.message;
            $('.esconder').hide();
            $("#aviso").show();
            $("#aviso").addClass("show");
        });
    });
    
    $('#fechar-alert').click(function (event){
        $("#aviso").hide();
    });
});
