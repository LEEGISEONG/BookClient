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

function searchComments(){

	if(event.keyCode == 13){

		$.ajax({
			url : "http://localhost:7070/book/bookCommentsList",
			type : "GET",
			dataType : "jsonp",
			jsonp : "callback",
			data : {
				keyword : $("#keyword").val()
			},
			success : function(data){

				$("tbody").empty();

				for(var i = 0 ; i < data.length ; i++) {

					var tr = $("<tr></tr>");
					tr.attr("data-isbn", data[i].isbn);
					tr.attr("cid",data[i].cid);
					tr.attr("id", "comTr");

					var ctitleTd = $("<td></td>").text(data[i].ctitle);
					var ctextTd =$("<td></td>").text(data[i].ctext);
					var authorTd = $("<td></td>").text(data[i].author);
					var delTd = $("<td></td>");

					var da = data[i].date.split("/")
					var dateTd = $("<td></td>").text(Number(da[0])+1900+"/"+(Number(da[1])+1)+"/"+Number(da[2]));

					var delBtn = $("<input class='btn btn-default'>");
					delBtn.attr("type", "button");
					delBtn.attr("value", "삭제");
					delBtn.attr("id", "comdelBtn");

					delTd.append(delBtn);

					tr.append(ctitleTd);
					tr.append(ctextTd);
					tr.append(authorTd);
					tr.append(dateTd)
					tr.append(delTd);

					$("tbody").append(tr);
				}

			},
			error : function(){
				alert("이상하네 ")
			}
		});
	}
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


$(document).on('click', '#comdelBtn', function () {

	var isbn = $(this).parent().parent().attr("data-isbn");
	var id = $(this).parent().parent().attr("cid");

	var author = $(this).parent().parent().find("td:nth-child(3)").text();

	alert(author+" / "+userId)
	if(author!=userId){
		alert(userId+"님이 작성한 글이 아닙니다!");
		return;
	}

	$(this).parent().parent().remove();

	$.ajax({
		url : "http://localhost:7070/book/deleteCommentBook",
		type : "GET",
		dataType : "jsonp",
		jsonp : "callback",
		data : {
			isbn : isbn,
			id : id
		},
		success : function(result){
			alert("정상적으로 처리 되었습니다.");
		},
		error : function() {
			alert("삭제 에러 발생");
		}
	});
});


$(document).on('click', '#comTr', function () {
	// alert($(this).attr("data-isbn") +" / " + $(this).attr("cid"))

	var isbn = $(this).attr("data-isbn");
	var thTr = $(this);
	var infoTableTr = $("<tr></tr>")
	var infoTd =  $("<td colspan='5'></td>")
	var infoTable = $("<userState class='userState userState-striped'></userState>");
	var infoHead = $("<thead></thead>");
	var infoTr=$("<tr></tr>")
	var img=$("<img>")
	var imgTh=$("<th></th>").text("이미지");
	var titleTh=$("<th></th>").text("제목");
	var authorTh=$("<th></th>").text("저자");
	var priceTh=$("<th></th>").text("가격");
	var closeTh = $("<th></th>").text("닫기");

	var infoTbody = $("<tbody></tbody>");

	infoTr.append(imgTh);
	infoTr.append(titleTh);
	infoTr.append(authorTh);
	infoTr.append(priceTh);
	infoTr.append(closeTh);

	infoHead.append(infoTr);

	infoTable.append(infoHead);
	infoTable.append(infoTbody);


	infoTd.append(infoTable);
	infoTableTr.append(infoTd)
	thTr.after(infoTableTr);


	$.ajax({
		url : "http://localhost:7070/book/bookInfo",
		type : "GET",
		dataType : "jsonp",
		jsonp : "callback",
		data : {
			isbn : isbn
		},
		success : function(data){

			var tr = $("<tr ></tr>").attr("data-isbn", data.isbn);
			var tdTd = $("<td colspan='5'></td>");
			var img = $("<img />").attr("src", data.img);
			var imgTd = $("<td></td>").append(img);
			var titleTd = $("<td></td>").text(data.title);
			var authorTd = $("<td></td>").text(data.author);
			var priceTd = $("<td></td>").text(data.price);
			var closeTd = $("<td></td>");

			var closeBtn = $("<input class='btn btn-default'>");
			closeBtn.attr("type", "button");
			closeBtn.attr("value", "닫기");
			closeBtn.on("click", function(){
				$(this).parent().parent().parent().parent().parent().remove();

			});


			closeTd.append(closeBtn);
			imgTd.append(img);

			tr.append(imgTd);
			tr.append(titleTd);
			tr.append(authorTd);
			tr.append(priceTd);
			tr.append(closeTd);

			tdTd.append(tr);
			infoTbody.append(tdTd);
		},
		error : function(){
			alert("이상하네 ")
		}
	});
});
