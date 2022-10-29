function getYear(year) {
	if (year) {
		return year.match(/[\d]{4}/); // This is regex: https://en.wikipedia.org/wiki/Regular_expression
	}
}

function iterateRecords(results) {
	// https://leafletjs.com/examples/quick-start/

	//sets map up
	let map = L.map("map").setView([-21, 148], 8);

	//gets user location
	navigator.geolocation.getCurrentPosition((position) => {
		const { latitude, longitude } = position.coords;
		//centers map on user
		map.setView([latitude, longitude]);
	});

	//add bottom contributions
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 18,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);

	//check results came through
	console.log(results);

	let markers = new Array();
	let i = 0;
	// Iterate over each record and add a marker using the Latitude field (also containing longitude)
	$.each(results.result.records, function (recordID, recordValue) {
		let recordLatitude = recordValue["Latitude"];
		if (recordLatitude) {
			i++;
			//split record 'recordLatitude' by ',' delimiter
			let latLong = recordLatitude.split(",");
			let pointLat = latLong[0];
			let pointLong = latLong[1];

			//popup data
			let popupData = "<h3>" + recordValue["Name Of Mine"] + "</h3>" + "<p>" + recordValue["Remarks"] + "</p>" + '<a onclick="openPopup(' + recordID + ')">Click For Question</p>';

			//marker on at location. Tooltip is Mine name. Markers rise when hovered.
			let marker = L.marker([pointLat, pointLong], {
				title: recordValue["Name Of Mine"],
				riseOnHover: true,
			})
				//add popup containing popup data.
				.addTo(map)
				.bindPopup(popupData);
			//store all markers;
			markers[markers.length] = marker;
		}
		console.log(i);
	});
}

$(document).ready(function () {
	let ajaxInputMining = {
		resource_id: "35ea936d-083e-4ad6-beab-e0fede2cd3a6",
		limit: 100,
	};

	$.ajax({
		url: "https://www.data.qld.gov.au/api/3/action/datastore_search",
		data: ajaxInputMining,
		dataType: "jsonp",
		cache: true,
		success: function (results) {
			console.log("len " + results.length);
			iterateRecords(results);
		},
	});
});

function openPopup(i) {
	document.getElementById("modal").classList.remove("closed");
	document.getElementById("modal").classList.add("open");
}

function closePopup() {
	document.getElementById("modal").classList.remove("open");
	document.getElementById("modal").classList.add("closed");
}
