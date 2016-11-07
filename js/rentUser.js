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
				$(location).attr("href", "index.html");
			}else{
				userId =result.ID;
				userState.text(userId);
				searchUserRent(userId);
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

function searchUserRent(user){


	var isSearch = false;
	if(user==null){
		inputUser =$("#keyword").val();

	}else{

		inputUser=user;
		isSearch=true;
	}

	if((event.keyCode == 13)||isSearch){
		isSearch = false;
		$.ajax({
			url : "http://localhost:7070/book/rentUserBook",
			type : "GET",
			dataType : "jsonp",
			jsonp : "callback",
			data : {
				keyword : inputUser
			},
			success : function(data){
				$("#whos").text(inputUser+"'s Book List")
				$("tbody").empty();
				for(var i = 0 ; i < data.length ; i++) {

					var tr = $("<tr></tr>").attr("data-isbn", data[i].isbn);
					var img = $("<img width='145' height'199'/>").attr("src", data[i].img);
					var imgTd = $("<td></td>").append(img);
					var titleTd = $("<td></td>").text(data[i].title);
					var authorTd = $("<td></td>").text(data[i].author);
					var rentTd = $("<td></td>");


					var returnBtn = $("<input class='btn btn-default'>");
					returnBtn.attr("type", "button");
					returnBtn.attr("value", "반납하기");
					returnBtn.attr("id", "returnBtn");
					rentTd.append(returnBtn);


					tr.append(imgTd);
					tr.append(titleTd);
					tr.append(authorTd);
					// tr.append(whoTd);
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

	var trtr =$(this).parent().parent();
	var nowTd = trtr.find("td:nth-child(4)");
	var stateTd = trtr.find("td:nth-child(5)");

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

			trtr.remove()
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

			nowTd.text(userId);

			stateTd.empty();
			stateTd.append(returnBtn);
			alert("대여 성공")
		},
		error: function () {
			alert("대여 에러 발생");
		}
	});
});
