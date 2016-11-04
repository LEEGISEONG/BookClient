var logout;
var login;
var userId;

$(document).ready(function() {
	table = $("#userState").css("overflow", "auto");

	state = $("<li></li>").css("float", "left").css("color","white");
	id = $("<li></li>").css("float", "left");
	logout = $("<button type='button' class='btn btn-sm btn-default'>Logout</button>");
	login = $("<button type='button'  class='btn btn-sm btn-default'>Login</button>");

	logout.attr("onclick", "out()")
	login.attr("onclick","location.href='login.html'");

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
				state.append(login)  ;
				table.append(state);
				$(location).attr("href", "index.html");
			}else{


				userId=result.ID;
				$("#whos").text(userId+"'s Book List")
				id.text(userId);
				state.append(id);
				state.append(logout);
				table.append(state);

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

function searchUserRent(user){

	var useruser;
	var isSearch = false;
	if(user==null){
		useruser =$("#keyword").val();
	}else{
		alert("dd");
		useruser=user;
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
				keyword : useruser
			},
			success : function(data){

				$("tbody").empty();
				for(var i = 0 ; i < data.length ; i++) {

					var tr = $("<tr></tr>").attr("data-isbn", data[i].isbn);
					var img = $("<img />").attr("src", data[i].img);
					var imgTd = $("<td></td>").append(img);
					var titleTd = $("<td></td>").text(data[i].title);
					var authorTd = $("<td></td>").text(data[i].author);
					var rentTd = $("<td></td>");


					var returnBtn = $("<input>");
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

	// alert(isbn+" "+userId);
	var rentBtn = $("<input>");
	rentBtn.attr("type", "button");
	rentBtn.attr("value", "대여하기");
	rentBtn.attr("id", "rentBtn");

	var trtr =$(this).parent().parent();
	var nowTd = trtr.find("td:nth-child(4)");
	var stateTd = trtr.find("td:nth-child(5)");

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

	// alert(isbn+" "+userId);
	var returnBtn = $("<input>");
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
