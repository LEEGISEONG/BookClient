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

function searchComments(){

	if(event.keyCode == 13){

		$.ajax({
			url : "http://localhost:7070/book/bookCommentList",
			type : "GET",
			dataType : "jsonp",
			jsonp : "callback",
			data : {
				keyword : $("#keyword").val()
			},
			success : function(data){

				$("tbody").empty();
				for(var i = 0 ; i < data.length ; i++) {

					var tr = $("<tr></tr>").attr("data-isbn", data[i].isbn);
					// var tr = $("<tr></tr>").attr("id", data[i].isbn);
					var img = $("<img />").attr("src", data[i].img);
					var imgTd = $("<td></td>").append(img);
					var titleTd = $("<td></td>").text(data[i].title);
					var authorTd = $("<td></td>").text(data[i].author);
					var priceTd = $("<td></td>").text(data[i].price);
					var comTd = $("<td></td>");
					var delTd = $("<td></td>");
					// var infoDiv = $("<div id='infoDiv'></div>");
					// var infoTa = $("<table id='infoTa'></table>");

					// var commDiv = $("<div id='commDiv'></div>");
					// var commTa = $("<table id='commTa'></table>");

					var comseeBtn = $("<input>");
					comseeBtn.attr("type", "button");
					comseeBtn.attr("value", "서평보기");
					comseeBtn.attr("id", "comseeBtn");

					var comwriteBtn = $("<input>");
					comwriteBtn.attr("type", "button");
					comwriteBtn.attr("value", "서평작성");
					comwriteBtn.attr("id", "comwriteBtn");

					var detaBtn = $("<input>");
					detaBtn.attr("type", "button");
					detaBtn.attr("value", "상세보기");
					detaBtn.attr("id", "detaBtn");

					comTd.append(comseeBtn);
					comTd.append(comwriteBtn);
					titleTd.append(detaBtn);
					// infoDiv.append(infoTa);
					// titleTd.append(infoDiv);

					// commDiv.append(commTa);

					var delBtn = $("<input>");
					delBtn.attr("type", "button");
					delBtn.attr("value", "삭제");
					delBtn.attr("id", "delBtn");

					delTd.append(delBtn);

					var updateBtn =$("<input>");
					updateBtn.attr("type", "button")
					updateBtn.attr("value","수정");
					updateBtn.attr("id", "updateBtn");


					var saveBtn =$("<input>");
					saveBtn.attr("type", "button")
					saveBtn.attr("value","저장");
					saveBtn.attr("id", "saveBtn");

					$(this).parent().parent().find("#saveBtn").attr("disabled","disabled");

					updateBtn.on("click", function(){

						// updateBtn.hide();
						var title = $(this).parent().parent().find("td:nth-child(2)").text();
						var author = $(this).parent().parent().find("td:nth-child(3)").text();
						var price = $(this).parent().parent().find("td:nth-child(4)").text();

						var titleBox =$("<input />").attr("type", "text").attr("id", "title").val(title);
						var authorBox =$("<input />").attr("type", "text").val(author);
						var priceBox =$("<input />").attr("type", "text").val(price);

						$(this).parent().parent().find("td:nth-child(2)").text("");
						$(this).parent().parent().find("td:nth-child(2)").append(titleBox);

						$(this).parent().parent().find("td:nth-child(3)").text("");
						$(this).parent().parent().find("td:nth-child(3)").append(authorBox);

						$(this).parent().parent().find("td:nth-child(4)").text("");
						$(this).parent().parent().find("td:nth-child(4)").append(priceBox);

						// var tr = $(this).parent().parent();

						$(this).parent().parent().find("#saveBtn").attr("abled","abled");
						$(this).parent().parent().find("#updateBtn").attr("disabled","disabled");
					});


					var updateTd = $("<td></td>");
					updateTd.append(updateBtn);
					updateTd.append(saveBtn);

					tr.append(imgTd);
					tr.append(titleTd);
					tr.append(authorTd);
					tr.append(priceTd);
					tr.append(comTd);
					tr.append(delTd);
					tr.append(updateTd);
					// tr.append(commDiv);

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


// $(document).on('click', '#addBtn', function() {
function addBook(){
	$("tbody").empty();


	var tr = $("<tr></tr>");

	var img = $("<img />");
	var imgTd = $("<td></td>").append(img);
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

	imgTd.append(img);
	isbnTd.append(isbnIn);
	titleTd.append(titleIn);
	authorTd.append(authorIn);
	priceTd.append(priceIn);
	delTd.append(saveBtn);

	tr.append(imgTd);
	tr.append(isbnTd);
	tr.append(titleTd);
	tr.append(authorTd);
	tr.append(priceTd);
	tr.append(delTd);

	$("tbody").append(tr);


// });
}
$(document).on('click', '#insertBtn', function() {
	var isbn = $(this).parent().parent().find("td:nth-child(2)>input").val();
	var title = $(this).parent().parent().find("td:nth-child(3)>input").val();
	var author = $(this).parent().parent().find("td:nth-child(4)>input").val();
	var price = $(this).parent().parent().find("td:nth-child(5)>input").val();
	$(this).parent().parent().remove();

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
			alert("업데이트 에러 발생");
		}
	});
});

$(document).on('click', '#saveBtn', function() {

	var isbn = $(this).parent().parent().attr("data-isbn");
	var title = $(this).parent().parent().find("td:nth-child(2)>input").val();
	var author = $(this).parent().parent().find("td:nth-child(3)>input").val();
	var price = $(this).parent().parent().find("td:nth-child(4)>input").val();


	$(this).parent().parent().find("td:nth-child(2)").empty();
	$(this).parent().parent().find("td:nth-child(2)").text(title);
	$(this).parent().parent().find("td:nth-child(3)").empty();
	$(this).parent().parent().find("td:nth-child(3)").text(author);
	$(this).parent().parent().find("td:nth-child(4)").empty();
	$(this).parent().parent().find("td:nth-child(4)").text(price);


	$.ajax({
		url : "http://localhost:7070/book/bookUpdate",
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
			alert("업데이트 에러 발생");
		}
	});

	$(this).parent().parent().find("#updateBtn").attr("abled","abled");
	$(this).parent().parent().find("#saveBtn").attr("disabled","disabled");


});

$(document).on('click', '#delBtn', function() {

	var isbn = $(this).parent().parent().attr("data-isbn");
	$(this).parent().parent().remove();

	$.ajax({
		url : "http://localhost:7070/book/deleteBook",
		type : "GET",
		dataType : "jsonp",
		jsonp : "callback",
		data : {
			isbn : isbn
		},
		success : function(result){


			// alert(result)
			alert("정상적으로 처리 되었습니다.");

		},
		error : function() {
			alert("삭제 에러 발생");
		}
	});

	// $(this).parent().parent().find("#updateBtn").attr("disabled","disabled");

});

$(document).on('click', '#detaBtn', function () {

	var ta = $(this).parent().parent().find("td:nth-child(2)");
	var isbn = $(this).parent().parent().attr("data-isbn");
	$(this).attr("disabled","disabled");

	$.ajax({
		url: "http://localhost:7070/book/bookDetails",
		type: "GET",
		dataType: "jsonp",
		jsonp: "callback",
		data: {
			isbn: isbn
		},
		success: function (result) {


			var table = $("<table></table>");
			var tbody = $("<tbody></tbody>");

			var dateTr = $("<tr></tr>");
			var datetiTd = $("<th></th>").text("날짜");
			var dateTd = $("<td></td>").text(result.date);

			var pageTr = $("<tr></tr>");
			var pagetiTd = $("<th></th>").text("page");
			var pageTd = $("<td></td>").text(result.page);

			var translatorTr = $("<tr></tr>");
			var translatortiTd = $("<th></th>").text("역자");
			var translatorTd = $("<td></td>").text(result.translator);

			var supplementTr = $("<tr></tr>");
			var supplementtiTd = $("<th></th>").text("supplement");
			var supplementTd = $("<td></td>").text(result.supplement);

			var publisherTr = $("<tr></tr>");
			var publishertiTd = $("<th></th>").text("출판사");
			var publisherTd = $("<td></td>").text(result.publisher);

			// var t = $("#dt").text();


				dateTr.append(datetiTd);
				dateTr.append(dateTd);

				pageTr.append(pagetiTd);
				pageTr.append(pageTd);

				translatorTr.append(translatortiTd);
				translatorTr.append(translatorTd);

				supplementTr.append(supplementtiTd);
				supplementTr.append(supplementTd);

				publisherTr.append(publishertiTd);
				publisherTr.append(publisherTd);

				tbody.append(dateTr);
				tbody.append(pageTr);
				tbody.append(translatorTr);
				tbody.append(supplementTr);
				tbody.append(publisherTr);

				table.append(tbody);

				ta.append(table);


		},
		error: function () {
			alert("상세보기 에러 발생");
		}
	});
});

var commentGo= false;
$(document).on('click', '#comseeBtn', function () {

	var isbn = $(this).parent().parent().attr("data-isbn");
	var tr = $(this).parent().parent();

	var comtr = $("<tr></tr>");
	var comDiv = $("<div ></div>")
	var comTa = $("<table class='table table-striped'></table>");

	var comTb = $("<tbody></tbody>");



	$(this).parent().parent().find("#comseeBtn").attr("disabled","disabled");

	$.ajax({
		url: "http://localhost:7070/book/bookComments",
		type: "GET",
		dataType: "jsonp",
		jsonp: "callback",
		data: {
			isbn: isbn
		},
		success: function (result) {
			for(var i = 0 ; i<result.length ; i ++){

				var commentTr = $("<tr></tr>").attr("cid",result[i].id)
					commentTr.attr("data-isbn", isbn);
				var titleTd = $("<th></th>").text(result[i].title);
				var textTd = $("<td></td>").text(result[i].text);
				var authorTd = $("<td></td>").text(result[i].author);
				var dateTd = $("<td></td>").text(result[i].date);
				var comdelBtn = $("<input >");
				comdelBtn.attr("type", "button");
				comdelBtn.attr("value", "서평삭제");
				comdelBtn.attr("id", "comdelBtn");
				
				commentTr.append(titleTd);
				commentTr.append(textTd);
				commentTr.append(authorTd);
				commentTr.append(dateTd);
				commentTr.append(comdelBtn);

				comTb.append(commentTr);
			}

			comTa.append(comTb);

			comDiv.append(comTa)
			comtr.append(comDiv);
			tr.after(comtr);

			commentGo=true;
		},
		error: function () {
			alert("상세보기 에러 발생");
		}
	});

});

$(document).on('click', '#comdelBtn', function () {

	var isbn = $(this).parent().attr("data-isbn");
	var id = $(this).parent().attr("cid");

	var author = $(this).parent().find("td:nth-child(3)").text();

	if(author!=userId){
		alert(userId+"님이 작성한 글이 아닙니다!");
		return;
	}

	$(this).parent().remove();

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


			// alert(result)
			alert("정상적으로 처리 되었습니다.");

		},
		error : function() {
			alert("삭제 에러 발생");
		}
	});
});

$(document).on('click', '#comwriteBtn', function () {

	var d = new Date();
	var da = (d.getYear()+1900)+". "+d.getMonth()+". "+d.getDate();
	var isbn = $(this).parent().attr("data-isbn");
	var tr = $(this).parent().parent();

	// var id = $(this).parent().attr("cid");
	var author = $(this).parent().find("td:nth-child(3)").text();

	var comtr = $("<tr></tr>");
	var comDiv = $("<div ></div>")
	var comTa = $("<table class='table table-striped'></table>");

	var comTb = $("<tbody></tbody>");

	var commentTr = $("<tr></tr>").attr("data-isbn", isbn);
	var titleTd = $("<th></th>");
	var textTd = $("<td></td>");
	var authorTd = $("<td></td>").text(userId);
	var dateTd = $("<td></td>").text(da);


	var titleIn = $("<input />").attr("type", "text").attr("placeholder","제목");
	var textIn = $("<input />").attr("type", "text").attr("placeholder", "내용");
	// var authorIn = $("<input />").attr("type", "text");
	// var priceIn = $("<input />").attr("type", "text");
	//var saveBtn = $("<input />").attr("type", "button").attr("value","저장").attr("id","insertBtn");

	titleTd.append(titleIn);
	textTd.append(textIn)

	var comdelBtn = $("<input >");
	comdelBtn.attr("type", "button");
	comdelBtn.attr("value", "서평저장");
	comdelBtn.attr("id", "comsaveBtn");

	commentTr.append(titleTd);
	commentTr.append(textTd);
	commentTr.append(authorTd);
	commentTr.append(dateTd);
	commentTr.append(comdelBtn);

	comTb.append(commentTr);

	comTa.append(comTb);

	comDiv.append(comTa)
	comtr.append(comDiv);
	tr.after(comtr);


});

$(document).on('click', '#comsaveBtn', function () {


	$.ajax({
		url: "http://localhost:7070/book/bookComments",
		type: "GET",
		dataType: "jsonp",
		jsonp: "callback",
		data: {
			isbn: isbn,
			title: title,
			text: text
		},
		success: function (result) {

		},
		error: function () {
			alert("상세보기 에러 발생");
		}
	});
});
