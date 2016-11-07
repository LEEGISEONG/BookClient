var userState;
var userId;
var id;
var logout;
var login;
var page;
var keyword;

$(document).ready(function() {

	page = new pager();
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
				userId = result.ID;
			}
		},
		error : function() {
			alert("로그인 상태 에러 발생");
		}
	});

});


var pager = function(options) {

	var defaults = {
		currentPage : 1 // 현재페이지
		,pageSize : 5 // 페이지 사이즈 (화면 출력 페이지 수)
		,maxListCount : 10 // (보여질)최대 리스트 수 (한페이지 출력될 항목 갯수)
		,startnum : 1 // 시작 글번호
		,lastnum : 10 // 마지막 글번호
		,totalCnt : 0 // 전체 글의 갯수.
		,totalPageCnt : 0 // 전체 페이지 수

	};

	this.buttonClickCallback = null;
	this.opts = $.extend({}, defaults, options);

};

pager.prototype = {

	"renderpager" : function(totalCnt, buttonClickCallback) {

		var _ = this;

		_.opts.totalCnt = totalCnt; //토탈 카운트 객체 멤버변수에 저장.

		var pageSize = this.opts.pageSize;
		var maxListCount = this.opts.maxListCount;
		var currentPage = this.opts.currentPage;

		if (totalCnt == 0) {
			return "";
		}

		//총페이지수 구하기 : 페이지 출력 범위 (1|2|3|4|5)
		var totalPageCnt = Math.ceil(totalCnt / maxListCount);

		//현재 블럭 구하기
		var n_block = Math.ceil(currentPage / pageSize);

		//페이징의 시작페이지와 끝페이지 구하기
		var s_page = (n_block - 1) * pageSize + 1; // 현재블럭의 시작 페이지
		var e_page = n_block * pageSize; // 현재블럭의 끝 페이지

		// setup $pager to hold render
		var $pager = $('#paging'); // TODO: 페이지를 출력할 영역. ( 출력할 영역의 ID를 인자로..  )
		$pager.empty(); //영역에 기존에 있던 내용 제거
		console.log("total : "+totalPageCnt + " / n_block : "+ n_block+" / s_page : "
			+s_page +"/ e_page : "+e_page)

		//처음, 이전 버튼 추가
		$pager.append(this.renderButton('first', totalPageCnt, _.buttonClickCallback))
			.append(this.renderButton('prev', totalPageCnt,    _.buttonClickCallback));

		//페이지 나열
		for (var j = s_page; j <= e_page; j++) {
			if (j > totalPageCnt)    break;

			var currentButton = $('<li >' + (j) + '</li>');

			//현재 페이지일경우 select 클래스 추가.
			if (j == currentPage)    currentButton.addClass('selected');
			else currentButton.click(function() {

				_.initNum(parseInt(this.firstChild.data));
				_.buttonClickCallback(this.firstChild.data);
			});

			currentButton.appendTo($pager); //페이징 영역에 버튼 추가
		}

		//다음, 마지막 버튼 추가
		$pager.append(this.renderButton('next', totalPageCnt,    _.buttonClickCallback))
			.append(this.renderButton('last', totalPageCnt,    _.buttonClickCallback));

		return $pager;
	},
	"initNum" : function(cp) {
		console.log("initNum : cp -"+cp)
		this.opts.currentPage = cp;

		this.opts.startnum = (cp - 1) * this.opts.maxListCount;

		var tmp = (cp * this.opts.maxListCount) -1;
		this.opts.lastnum = (tmp > this.opts.totalCnt ? this.opts.totalCnt
			: tmp);

		console.log("P:"+cp+"/startnum:"+this.opts.startnum+"/lastnum:"+this.opts.lastnum);
		setList(this.opts.startnum, keyword)
	},

	"renderButton" : function(buttonLabel, totalPageCnt,
							  buttonClickCallback) {
		var _ = this;
		var currentPage = this.opts.currentPage;
		//var totalPageCnt = this.opts.totalPageCnt;

		var $Button = $('<li >' + buttonLabel + '</li>');
		var destPage = 1;

		switch (buttonLabel) {
			case "first":
				destPage = 1;
				$Button.addClass('active');
				$Button.html('처음');
				break;

			case "prev":
				destPage = currentPage - 1;
				$Button.append("<a href='#' aria-label='Previous'>")
					.append("<span aria-hidden='true'>&laquo;</span>")
				$Button.addClass('active');
				$Button.html('이전');
				break;

			case "next":
				destPage = currentPage + 1;
				$Button.addClass('active');
				$Button.html('다음');
				break;

			case "last":
				destPage = totalPageCnt;
				$Button.addClass('active');
				$Button.html('마지막');
				break;
		}

		if (buttonLabel == "first" || buttonLabel == "prev") { //1페이지에서는 처음, 이전 버튼 안보이게

			if(    currentPage <= 1 ) $Button.addClass('pgEmpty').css("display", "none")
			else $Button.click(function() {    _.initNum(destPage); buttonClickCallback(); });
		} else {
			if( currentPage >= totalPageCnt) $Button.addClass('pgEmpty').css("display", "none")
			else $Button.click(function() { _.initNum(destPage); buttonClickCallback();    });
		}
		return $Button; //생성된 버튼 반환
	}
};



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

function searchBook(){

	if(event.keyCode == 13){

		keyword = $("#keyword").val();
		$.ajax({
			url : "http://localhost:7070/book/bookListNum",
			type : "GET",
			dataType : "jsonp",
			jsonp : "callback",
			data : {
				keyword : keyword

			},
			success : function(data){
				var maxPage = data.num;

				console.log("max "+maxPage)

				page = new pager();

				page.buttonClickCallback = listContent;

				function listContent () {
					page.renderpager(maxPage);
				}

				listContent();


			},
			error :function(){
			}
		});

		setList(0, keyword)
	}

}

function setList(start, keyword){
	console.log(start +" ~ " + " / " + keyword )
	$.ajax({

		url : "http://localhost:7070/book/bookList",
		type : "GET",
		dataType : "jsonp",
		jsonp : "callback",
		data : {
			keyword : keyword,
			start : start
		},
		success : function(data){

			$("tbody").empty();

			for(var i = 0 ; i < data.length ; i++) {

				var tr = $("<tr></tr>").attr("data-isbn", data[i].isbn);
				tr.attr("idx", i);

				var img = $("<img />").attr("src", data[i].img);
				var imgTd = $("<td></td>").append(img);
				var titleTd = $("<td></td>").text(data[i].title);
				var authorTd = $("<td></td>").text(data[i].author);
				var priceTd = $("<td></td>").text(data[i].price);
				var comTd = $("<td></td>");


				var comseeBtn = $("<input class='btn btn-success'>");
				comseeBtn.attr("type", "button");
				comseeBtn.attr("value", "서평보기");
				comseeBtn.attr("id", "comseeBtn");

				var comwriteBtn = $("<input class='btn btn-success'>");
				comwriteBtn.attr("type", "button");
				comwriteBtn.attr("value", "서평작성");
				comwriteBtn.attr("id", "comwriteBtn");

				var detaBtn = $("<input class='btn btn-primary'>");
				detaBtn.attr("type", "button");
				detaBtn.attr("value", "상세보기");
				detaBtn.attr("id", "detaBtn");

				titleTd.append(detaBtn);

				var delBtn = $("<input class='btn btn-default'>");
				delBtn.attr("type", "button");
				delBtn.attr("value", "삭제");
				delBtn.attr("id", "delBtn");


				var updateBtn =$("<input class='btn btn-danger'>");
				updateBtn.attr("type", "button")
				updateBtn.attr("value","수정");
				updateBtn.attr("id", "updateBtn");


				var saveBtn =$("<input class='btn btn-warning'>");
				saveBtn.attr("type", "button")
				saveBtn.attr("value","저장");
				saveBtn.attr("id", "saveBtn");

				$(this).parent().parent().find("#saveBtn").attr("disabled","disabled");

				comTd.append(comseeBtn);
				comTd.append(comwriteBtn)
				comTd.append(updateBtn);
				comTd.append(saveBtn);

				updateBtn.on("click", function(){

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

					$(this).parent().parent().find("#saveBtn").attr("abled","abled");
					$(this).parent().parent().find("#updateBtn").attr("disabled","disabled");
				});

				tr.append(imgTd);
				tr.append(titleTd);
				tr.append(authorTd);
				tr.append(priceTd);
				tr.append(comTd);

				$("tbody").append(tr);
			}
		},
		error : function(){
			alert("이상하네 ")
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


			alert("정상적으로 처리 되었습니다.");

		},
		error : function() {
			alert("삭제 에러 발생");
		}
	});


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


			var table = $("<br><table></table>");
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

$(document).on('click', '#comseeBtn', function () {

	var isbn = $(this).parent().parent().attr("data-isbn");
	var tr = $(this).parent().parent();

	var tddd = $("<td colspan='5'></td>");
	// var comDiv = $("<div ></div>")
	var comTa = $("<table class='table table-striped'></table>");
	var comHead = $("<thead></thead>");
	var comTr=$("<tr></tr>")
	var titleTh=$("<th></th>").text("제목");
	var textTh=$("<th></th>").text("내용");
	var authorTh=$("<th></th>").text("작성자");
	var dateTh=$("<th></th>").text("작성일");

	var comTb = $("<tbody></tbody>");

	comTr.append(titleTh)
	comTr.append(textTh)
	comTr.append(authorTh)
	comTr.append(dateTh)
	comHead.append(comTr);
	comTa.append(comHead);
	tddd.append(comTa)
	tr.after(tddd);

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
				var saveTd = $("<td></td>")

				var da = result[i].date.split("/")

				// alert(Number(da[0])+1900+"/"+(Number(da[1])+1)+"/"+Number(da[2]));

				var dateTd = $("<td></td>").text(Number(da[0])+1900+"/"+(Number(da[1])+1)+"/"+Number(da[2]));
				var comdelBtn = $("<input >");
				comdelBtn.attr("type", "button");
				comdelBtn.attr("value", "서평삭제");
				comdelBtn.attr("id", "comdelBtn");
				saveTd.append(comdelBtn)
				commentTr.append(titleTd);
				commentTr.append(textTd);
				commentTr.append(authorTd);
				commentTr.append(dateTd);
				commentTr.append(saveTd);

				comTb.append(commentTr);
			}

			comTa.append(comTb);


		},
		error: function () {
			alert("서평보기 에러 발생");
		}
	});

});

$(document).on('click', '#comdelBtn', function () {

	var isbn = $(this).parent().parent().attr("data-isbn");
	var id = $(this).parent().parent().attr("cid");

	var author = $(this).parent().parent().find("td:nth-child(3)").text();
	// alert(author +"  "+userId);

	// alert(author!=userId)
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
	var da = (d.getYear()+1900)+"/"+(d.getMonth()+1)+"/"+d.getDate();
	var isbn = $(this).parent().parent().attr("data-isbn");
	var tr = $(this).parent().parent();

	var author = $(this).parent().find("td:nth-child(3)").text();

	var comtr = $("<tr></tr>");
	var comDiv = $("<div ></div>")
	var comTa = $("<userState class='userState userState-striped'></userState>");

	var comTb = $("<tbody></tbody>");

	var commentTr = $("<tr></tr>").attr("data-isbn", isbn);
	var titleTd = $("<th></th>");
	var textTd = $("<td></td>");
	var authorTd = $("<td></td>").text(userId);
	var dateTd = $("<td></td>").text(da);
	var saveTd = $("<td></td>")


	var titleIn = $("<input />").attr("type", "text").attr("placeholder","제목");
	var textIn = $("<input />").attr("type", "text").attr("placeholder", "내용");

	titleTd.append(titleIn);
	textTd.append(textIn)

	var comdelBtn = $("<input class='btn btn-default'>");
	comdelBtn.attr("type", "button");
	comdelBtn.attr("value", "서평저장");
	comdelBtn.attr("id", "comsaveBtn");
	saveTd.append(comdelBtn)
	commentTr.append(titleTd);
	commentTr.append(textTd);
	commentTr.append(authorTd);
	commentTr.append(dateTd);
	commentTr.append(saveTd);

	comTb.append(commentTr);

	comTa.append(comTb);

	comDiv.append(comTa)
	comtr.append(comDiv);
	tr.after(comtr);


});

$(document).on('click', '#comsaveBtn', function () {

	var isbn = $(this).parent().parent().attr("data-isbn");
	var title = $(this).parent().parent().find("th>input").val();
	var text = $(this).parent().parent().find("td:nth-child(2)>input").val();
	var btnTd = $(this).parent().parent().find("td:last");
	//var saveBtn = $(this).parent().parent().find("td:last>input");
	var d = new Date();
	var date = d.getYear()+"/"+d.getMonth()+"/"+d.getDate();


	var comdelBtn = $("<input >");
	comdelBtn.attr("type", "button");
	comdelBtn.attr("value", "서평삭제");
	comdelBtn.attr("id", "comdelBtn");

	//alert(isbn+ " "+title +  text+date);

	var  textTd= $(this).parent().parent().find("td:nth-child(2)")
	var  titleTd= $(this).parent().parent().find("th")
	$.ajax({
		url: "http://localhost:7070/book/bookcommentInsert",
		type: "GET",
		dataType: "jsonp",
		jsonp: "callback",
		data: {
			isbn: isbn,
			title: title,
			text: text,
			author : userId,
			date : date
		},
		success: function (result) {

			titleTd.empty();
			titleTd.text(title);
			textTd.empty();
			textTd.text(text);
			btnTd.empty();
			// alert(saveBtn.val());

			btnTd.append(comdelBtn);

		},
		error: function () {
			alert("상세보기 에러 발생");
		}
	});
});
