$(document).ready(function () {
    console.log("ready");
    console.log("ready");
     
	  // Do something here

		$.ajax({
			type: "GET",
			dataType: "json",
			url: "https://2o9gd25u11.execute-api.ap-south-1.amazonaws.com/dev",
			cache: false,
			success: function (data) {
				console.log(data);
				console.log(data['Items'][0]['photo']);
			  
				console.log(data['Count']);
				
				data['Items'].sort(function (a, b) {
					if (a.dateandtime > b.dateandtime) {
						return 1;
					} else if (a.dateandtime < b.dateandtime) {
						return -1;
					} else {
						return 0;
					}
				});
				var i;
				for (i = 0; i < data['Count']; i++)
				{
					var s = '<div class="item">' +
						'<img src="' + data['Items'][i]['photo']+'"  width="200" height="200">'+
						'<p> <b>Date: </b>' + data['Items'][i]['dateandtime'] + '<br></p>' +
						'<p> <b>Moisture: </b>' + data['Items'][i]['moisture'] + '<br></p>' +
						'<p> <b>Humidity: </b>' + data['Items'][i]['humidity'] + '<br></p>' +
						'<p> <b>Rain: </b>' + data['Items'][i]['rain'] + '<br></p>' +
						'<p> <b>Temperature: </b>' + data['Items'][i]['temperature'] + '<br></p>' +
						'<p> <b>Light: </b>' + data['Items'][i]['light'] + '<br></p>' +
						'<p> <b>Water: </b>' + data['Items'][i]['water'] + '<br></p>' +
						'<p> <b>Raining: </b>' + data['Items'][i]['raining'] + '<br></p>' +
						'<p> <b>Pest: </b>' + data['Items'][i]['insect'] + '<br></p>' +
						' </div > ';
					$("#division").append(s + "<br>");

				};
					
				
			}
		});
});


  
