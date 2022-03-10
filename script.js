$(window).on("load",function(){
    $(".loader-wrapper").fadeOut(3000); // Tắt hiệu ứng loading sau 3s
});

$(document).ready(function(){
    // Hiển thị nội dung top headline
    fetchData("https://gnews.io/api/v4/top-headlines?token=168165a52396c540a7a32846708a198f&lang=en");

    //Hàm tìm nạp dữ liệu sau đó in ra màn hình
    function fetchData(link){
        fetch(link)
        .then(function (response) { 
            return response.json(); // Nhận dữ liệu trả về dạng chuỗi Json
        })
        .then(function (data) {
            handle(data); // Xử lý chuỗi Json
        });
    };
    // Hàm xử lý dữ liệu
    function handle(data) {
        const art = data.articles;
        var out = ""; // lưu code html để xuất ra màn hình
        for(var i = 0; i < art.length; i++){
            //Do "content" đầu vào ở cuối sẽ có "... [abcd chars]" nên cần xóa phần "[abcd chars]" này đi
            // bằng cách giảm độ dài chuỗi cho đến khi xuất hiện dấu "."
            var cnt = art[i].content; // chuỗi cnt = content thứ i
            var len = cnt.length; // len = độ dài chuỗi cnt
            while(cnt[len-1] !== "."){ // giảm độ dài chuỗi cho đến khi ký tự cuối ứng với độ dài này là "."
                len--;
            }
            cnt = cnt.substring(0, len); // chuỗi cnt mới sau khi loại bỏ phần thừa "[abcd chars]"

            out += '<div class="row"><div class="col-4"><img src="' + art[i].image + '" style="width:100%">' + '</div>' + '<div class="col-8"><a href="' + art[i].url + '" target="_blank">' + art[i].title + '</a><br><i>' + art[i].publishedAt +'</i><br><br><p>'+ cnt +'</p></div></div><br>';
        };
        $("#main").html(out); // xuất ra màn hình
        // Nếu không tìm được article nào xuất ra màn hình thông báo
        if(data.totalArticles == 0)
            $("#main").html("<h2>Your search did not match any documents.</h2><br><h3>Try to change a different language or region or time duration...");
    }
    // search articles theo requirements
    $("#search").click(function(){
        $(".loader-wrapper").fadeIn("fast"); // Bật lại hiệu ứng loading
        $(".loader-wrapper").fadeOut(3000); // Tắt hiệu ứng loading sau 3s
        var apiToken = "168165a52396c540a7a32846708a198f"; // mã api-Token
        var kw = $("#keyWords").val(); // lấy keywords
        var lang = $("#language").val(); // // lấy ngôn ngữ
        var reg = $("#region").val(); // lấy vùng/ quốc gia
        var sort = $("#sort").val(); // lấy tiêu chí tìm kiếm
        var date = timeISO8601(); // lấy khoảng thời gian theo ISO 8601
        var link = "https://gnews.io/api/v4/search?q="+ kw + "&token=" + apiToken + "&lang=" + lang + "&country=" + reg + "&sortby=" + sort + "&from=" + date;
        fetchData(link); // Tìm nạp và in ra màn hình
        $("#myModal").modal('hide'); // Đóng Modal Box
    });  
    function timeISO8601(){
        if($("#time").val() == 0) 
            return "none"; // Nếu không dùng bộ lọc thời gian thì xuất ra giá trị không
        else{
            var today = new Date(); // lấy ngày hiện tại
            today.setDate(today.getDate() - $("#time").val()); // ngày hiện tại -= khoảng thời gian tìm kiếm
            var date8601 = new String(today.toISOString()); // chuyển sang chuỗi ISO 8601
            // Do chuỗi ISO 8601 sẽ có phần milisecond nên cần xóa phần này
            date8601 = date8601.slice(0, date8601.length - 5) 
            date8601 += "Z";
        }
        return date8601; // trả về ngày dạng chuỗi ISO 8601
    }
});
