$(document).ready(function () {
    console.log("ready");
});
function getelement() {
    console.log("ready");
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://2o9gd25u11.execute-api.ap-south-1.amazonaws.com/dev",
        cache: false,
        success: function (data) {
            console.log(data);
            $("division").append(data);
        }
    });
}