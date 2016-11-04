/**
 * Created by CJuser on 2016-11-03.
 */

function join(){
    var id = $("#inputEmail").val();
    var password = $("#inputPassword").val();
    var passwordConfirm = $("#inputPasswordConfirm").val();

    alert(id);
    alert(password);
    alert(passwordConfirm);

    if(password == passwordConfirm) {
        $.ajax({
            url : "http://localhost:7070/book/memberJoin",
            type : "GET",
            dataType : "jsonp",
            jsonp : "callback",
            data : {
                id  : id,
                password : password
            },
            success : function(result){

                alert(id+"님 가입이 완료 되었습니다.");
            },
            error : function() {
                alert("이미 존재하는 E-mail입니다.");

            }
        });


    }else{
        alert("Password가 같지 않습니다.");
    }




}