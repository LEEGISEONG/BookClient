var table;
var state;
var id;
var logout;
var login;

$(document).ready(function() {
    table = $("#userState");

    state = $("<tr></tr>");
    id = $("<th></th>");
    logout = $("<button type='button' class='btn btn-sm btn-default'>Logout</button>");
    login = $("<button type='button'  class='btn btn-sm btn-default'>Login</button>");

    logout.attr("onclick", "out()")
    login.attr("onclick","location.href='login.html'");


    // alert("로딩 완료");

    $.ajax({
        url : "http://localhost:7070/book/memberState",
        type : "GET",
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            state : "state"
        },
        success : function(result){

            //id.text(result);
            // alert(result.ID);
            if(result.ID==null){
                // id.text(result);
                // state.append(id);
                // logout.remove();
                state.append(login)  ;
                table.append(state);
            }else{
                // alert(result.ID);
                id.text(result.ID);
                state.append(id);
                state.append(logout);
                table.append(state);
            }
        },
        error : function() {
            alert("로그인 상태 에러 발생");
        }
    });


});

// $(document).on('click', '#logout', function() {
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
            // state.append(id);
            id.empty();
            state.append(login);
            table.append(state);
            logout.remove();
            $(location).attr("href", "index.html");
        },
        error: function () {
            alert("로그아웃 상태 에러 발생");
        }
    });
}
// });