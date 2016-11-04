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

			//id.text(result);
			// alert(result.ID);
			if(result.ID==null){
				// id.text(result);
				// state.append(id);
				// logout.remove();
				state.append(login)  ;
				table.append(state);
				$(location).attr("href", "index.html");
			}else{
				// alert(result.ID);
				userId=result.ID;
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


function mySort() {
	var rows = $("table").find("tbody>tr").get();
	rows.sort(function (a, b) {
		var keyA = $(a).children("td").eq(3).text();
		var keyB = $(b).children("td").eq(3).text();

		if(keyA < keyB) return -1;
		if(keyA > keyB) return 1;

		return 0;
	});

	$.each(rows, function (idx, row) {
		$("table").children("tbody").append(row);
	});
}



function addBook(){
	$("tbody").empty();

	$("tbody").css("pointer-events", "none");

	var tr = $("<tr></tr>");

	var img = $("<div id='imgIn' ondrop='dDrop()'></div>");
	//var imgTd = $("<td></td>").append(img);
	var isbnTd = $("<td></td>");
	var titleTd = $("<td></td>");
	var authorTd = $("<td></td>");
	var priceTd = $("<td></td>");
	//var delTd = $("<td></td>");
	var delTd = $("<td></td>");

	var isbnIn = $("<input />").attr("type", "text");
	var titleIn = $("<input />").attr("type", "text");
	var authorIn = $("<input />").attr("type", "text");
	var priceIn = $("<input />").attr("type", "text");
	var saveBtn = $("<input />").attr("type", "button").attr("value","저장").attr("id","insertBtn");

	//imgTd.append(img);
	isbnTd.append(isbnIn);
	titleTd.append(titleIn);
	authorTd.append(authorIn);
	priceTd.append(priceIn);
	delTd.append(saveBtn);

	tr.append(img);
	tr.append(isbnTd);
	tr.append(titleTd);
	tr.append(authorTd);
	tr.append(priceTd);
	tr.append(delTd);

	$("tbody").append(tr);


}

$(document).on('click', '#insertBtn', function() {

	var isbn = $(this).parent().parent().find("td:nth-child(2)>input").val();
	var title = $(this).parent().parent().find("td:nth-child(3)>input").val();
	var author = $(this).parent().parent().find("td:nth-child(4)>input").val();
	var price = $(this).parent().parent().find("td:nth-child(5)>input").val();


	// $(this).parent().parent().find("td:nth-child(2)").empty();
	// $(this).parent().parent().find("td:nth-child(2)").text(title);
	// $(this).parent().parent().find("td:nth-child(3)").empty();
	// $(this).parent().parent().find("td:nth-child(3)").text(author);
	// $(this).parent().parent().find("td:nth-child(4)").empty();
	// $(this).parent().parent().find("td:nth-child(4)").text(price);


	$.ajax({
		url : "http://localhost:7070/book/bookInsert",
		type : "GET",
		dataType : "jsonp",
		jsonp : "callback",
		data : {
			isbn : isbn,
			title : title,
			author : author,
			price : price
		},
		success : function(result){


			// alert(title + author + price);
			// alert(result)
			alert("정상적으로 처리 되었습니다.");

		},
		error : function() {
			alert("추가 에러 발생");
		}
	});
});


var imgArr =[];

function dDrop(){
	alert($(this).attr("class"));
	alert("in")
	var newImg = new Image();
	var f = event.dataTransfer.files[0];
	var imgReader = new FileReader();

	imgReader.onload = function(){
		newImg.src = event.target.result;
		document.getElementById("targetDiv").appendChild(newImg);
		imgArr.push(newImg.src);
	}

	imgReader.readAsDataURL(f);


	event.preventDefault();
}

function saveImg(){

	// localStorage.imgArray = JSON.stringify(imgArr);
	localStorage.imgArray = JSON.stringify(imgArr);
	document.getElementById("targetDiv").innerHTML="";
	// alert(imgArr[0].src);
}
