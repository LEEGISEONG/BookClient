var userState;
var id;
var logout;
var login;

$(document).ready(function() {
	userState = $("#userState").css("float", "left");;


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
                $(location).attr("href", "index.html");
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


function mySort() {
	var rows = $("userState").find("tbody>tr").get();
	rows.sort(function (a, b) {
		var keyA = $(a).children("td").eq(3).text();
		var keyB = $(b).children("td").eq(3).text();

		if(keyA < keyB) return -1;
		if(keyA > keyB) return 1;

		return 0;
	});

	$.each(rows, function (idx, row) {
		$("userState").children("tbody").append(row);
	});
}



function addBook(){

	var img = localStorage.getItem("img");
	var isbn = $("#isbn").val();
	var title = $("#title").val();
	var author = $("#author").val();
	var translator = $("#translator").val();
	var supplement = $("#supplement").val();
	var publisher = $("#publisher").val();
	var price = $("#price").val();
	var date = $("#date").val();
	var page = $("#page").val();



	$.ajax({
		url : "http://localhost:7070/book/bookInsert",
		type : "GET",
		dataType : "jsonp",
		jsonp : "callback",
		data : {
			img : img,
			isbn : isbn,
			title : title,
			author : author,
			translator : translator,
			supplement : supplement,
			publisher : publisher,
			price : price,
			date : date,
			page : page
		},
		success : function(result){
			if(result){
				alert("정상적으로 처리 되었습니다.");
			}else{
				alert("추가 실패");
			}
		},
		error : function() {
			alert("추가 에러 발생");
		}
	});
}


var imgArr =[];

function dDrop(){

	var newImg = new Image();
	var f = event.dataTransfer.files[0];
	var imgReader = new FileReader();
	var srcsrc;
	imgReader.onload = function(){
		srcsrc= event.target.result;
		newImg.src =srcsrc;
		newImg.height = 199;
		newImg.width = 145;

		localStorage.setItem("img", srcsrc);
		document.getElementById("imgIn").appendChild(newImg);
		imgArr.push(newImg.src);

	}
	imgReader.readAsDataURL(f);
	event.preventDefault();

}

function saveImg(){

	localStorage.imgArray = JSON.stringify(imgArr);
	document.getElementById("targetDiv").innerHTML="";

}
