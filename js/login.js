function login(){
    var id = $("#inputEmail").val();
    var password = $("#inputPassword").val();

    if(password==''){
        return;
    }

    $.ajax({
        url : "http://localhost:7070/book/memberLogin",
        type : "GET",
        dataType : "jsonp",
        jsonp : "callback",
        data : {
            id  : id,
            password : password
        },
        success : function(result){
            if(result!=false){
                alert(id+"님! 안녕하세요!");
                $(location).attr("href", "index.html");
            }else{
                alert("존재하지 않는 Email 또는 PASSWORD가 올바르지 않습니다.");
            }

        },
        error : function() {
            alert("안돼네")
        }
    });

}