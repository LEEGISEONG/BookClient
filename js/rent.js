var userState;
var userId;
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
				userState.text("LogIn").attr("onclick","location.href='login.html'");
				$("#dropdown-menu").hide();
			}else{
				userId =result.ID;
				userState.text(userId);

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

function searchBookRent(){

	inputUser =$("#keyword").val();

	if(event.keyCode == 13){

		$.ajax({
			url : "http://localhost:7070/book/rentList",
			type : "GET",
			dataType : "jsonp",
			jsonp : "callback",
			data : {
				keyword : inputUser
			},
			success : function(data){

				$("tbody").empty();
				for(var i = 0 ; i < data.length ; i++) {

					var tr = $("<tr></tr>").attr("data-isbn", data[i].isbn);
					var img = $("<img />").attr("src", data[i].img);
					var imgTd = $("<td></td>").append(img);
					var titleTd = $("<td></td>").text(data[i].title);
					var authorTd = $("<td></td>").text(data[i].author);
					var whoTd = $("<td></td>").text(data[i].rent);
					var rentTd = $("<td></td>");

					if(data[i].rent==null){
						var rentBtn = $("<input class='btn btn-default'>");
						rentBtn.attr("type", "button");
						rentBtn.attr("value", "대여하기");
						rentBtn.attr("id", "rentBtn");
						rentTd.append(rentBtn);
					}else{
						var returnBtn = $("<input class='btn btn-default'>");
						returnBtn.attr("type", "button");
						returnBtn.attr("value", "대여중 반납");
						returnBtn.attr("id", "returnBtn");
						rentTd.append(returnBtn);
					}

					tr.append(imgTd);
					tr.append(titleTd);
					tr.append(authorTd);
					tr.append(whoTd);
					tr.append(rentTd);

					$("tbody").append(tr);
				}
			},
			error : function(){
				alert("이상하네 ")
			}
		});
	}
}



$(document).on('click', '#returnBtn', function () {

	var isbn = $(this).parent().parent().attr("data-isbn");


	var rentBtn = $("<input class='btn btn-default'>");
	rentBtn.attr("type", "button");
	rentBtn.attr("value", "대여하기");
	rentBtn.attr("id", "rentBtn");

	var nowTd = $(this).parent().parent().find("td:nth-child(4)");
	var stateTd = $(this).parent().parent().find("td:nth-child(5)");

	if(userId!=inputUser){
		alert("다른 사람이 대여 대여한 책이라 반납할 수 없습니다.")
		return;
	}

	$.ajax({
		url: "http://localhost:7070/book/returnBook",
		type: "GET",
		dataType: "jsonp",
		jsonp: "callback",
		data: {
			id : userId,
			isbn : isbn
		},
		success: function (result) {

			nowTd.text("");

			stateTd.empty();
			stateTd.append(rentBtn);
			alert("반납 성공")
		},
		error: function () {
			alert("반납 에러 발생");
		}
	});


});

$(document).on('click', '#rentBtn', function () {

	var isbn = $(this).parent().parent().attr("data-isbn");


	var returnBtn = $("<input class='btn btn-default'>");
	returnBtn.attr("type", "button");
	returnBtn.attr("value", "대여중 반납");
	returnBtn.attr("id", "returnBtn");

	var nowTd = $(this).parent().parent().find("td:nth-child(4)");
	var stateTd = $(this).parent().parent().find("td:nth-child(5)");

	$.ajax({
		url: "http://localhost:7070/book/rentBook",
		type: "GET",
		dataType: "jsonp",
		jsonp: "callback",
		data: {
			id : userId,
			isbn : isbn
		},
		success: function (result) {
			if (result) {
				nowTd.text(userId);
				stateTd.empty();
				stateTd.append(returnBtn);
				alert("대여 성공")
			}else{
				alert("대여 권수를 초과했습니다.")
			}
		},
		error: function () {
			alert("대여 에러 발생");
		}
	});
});
