var userState;
// var state;
var id;
var logout;
var login;

$(document).ready(function() {
    userState = $("#userState");


    $.ajax({
        url : "http://localhost:7070/book/memberState",
        type : "GET",
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            state : "state"
        },
        success : function(result){

            if(result.ID==null){
                userState.text("LogIn").attr("onclick","location.href='login.html'");
                $("#dropdown-menu").hide();
            }else{

                userState.text(result.ID);

            }
        },
        error : function() {
            alert("로그인 상태 에러 발생");
        }
    });


});

function out() {
    $.ajax({
        url: "http://localhost:7070/book/memberLogout",
        type: "GET",
        dataType: "jsonp",
        jsonp: "callback",
        data: {
            id: "id"
        },
        success: function (result) {
            userState.text("LogIn").attr("onclick","location.href='login.html'");
            $("#dropdown-menu").hide();
            $(location).attr("href", "index.html");
        },
        error: function () {
            alert("로그아웃 상태 에러 발생");
        }
    });
}