
function searchBook(){
	
	if(event.keyCode == 13){
		
		$.ajax({
			url : "http://localhost:7070/book/bookList",
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
					var img = $("<img />").attr("src", data[i].img);
					var imgTd = $("<td></td>").append(img);
					var titleTd = $("<td></td>").text(data[i].title);
					var authorTd = $("<td></td>").text(data[i].author);
					var priceTd = $("<td></td>").text(data[i].price);
					var delTd = $("<td></td>");


					var delBtn = $("<input>");
					delBtn.attr("type", "button");
					delBtn.attr("value", "삭제");
					// delBtn.attr("onclick", "delBook(this)");
					delBtn.on("click", function(){
					 	// 삭제처리
						($(this).parent()).parent().remove();

					});
					delTd.append(delBtn);

					var updateBtn =$("<input .>");
					updateBtn.attr("type", "button")
					updateBtn.attr("value","수정");
					updateBtn.on("click", function(){
						var price = $(this).parent().parent().find("td:nth-child(4)").text();
						var updatebox =$("<input />").attr("type", "text").val(price);

						updatebox.on("keyup", function(){

							if(event.keyCode==13){
								// update 처리!!
								// 일단 DB처리도 해야하고
								// AJAX호출해서 서버프로그램을 실행시켜서 Database의 데이터를
								// 변경하면되요!!
								// 서버프로그램에게 어떤 값을 알려줘야지 처리가 될까요? 
								// 변경된 책가격, isbn값이 필요해요
								var isbn = $(this).parent().parent().attr("data-isbn");
								var price = $(this).val();
								var tr = $(this).parent().parent();
								//alert(isbn+ " : "+ price);

								$.ajax({
									url : "http://localhost:7070/book/bookUpdate",
									type : "GET",
									dataType : "jsonp",
									jsonp : "callback",
									data : {
										isbn : isbn,
										price : price
									},
									success : function(result){
										alert("정상적으로 처리 되었습니다.");
										tr.find("td:nth-child(4)").empty();
										tr.find("td:nth-child(4)").text(price);
									},
									error : function() {
										alert("업데이트 에러 발생");
									}
								});

								// 화면 처리도 해야해요!!

							}
						});

						$(this).parent().parent().find("td:nth-child(4)").text("");
						$(this).parent().parent().find("td:nth-child(4)").append(updatebox);
						$(this).parent().parent().find("[type=button]").attr("disabled", "disabled");
					});
					var updateTd = $("<td></td>");
					updateTd.append(updateBtn);

					tr.append(imgTd);
					tr.append(titleTd);
					tr.append(authorTd);
					tr.append(priceTd);
					tr.append(delTd);
					tr.append(updateTd);


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