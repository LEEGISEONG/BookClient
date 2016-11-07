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

	alert(" \n" +
		isbn +"\n" +
		title +"\n" +
		author +"\n" +
		translator +"\n" +
		publisher +"\n" +
		price +"\n" +
		date +"\n" +
		page +"\n" +
		img)


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
