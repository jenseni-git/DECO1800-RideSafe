let BIKEWAYDATABASE;
let LATITUDE = -1;
let LONGITUDE = -1;
let LOCATIONJSON = -1;
let MARKERS = [];
let MAP;

function l(s) {
	console.log(s);
}

function titleCase(str) {
	return str.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
}

function addLocation(number, unlocked, streetName, length, coords) {
	let locationDetails = document.getElementById("locationDetails");
	let lockVal = "locked";
	let blurred = " blur";
	let link = "span";
	if (unlocked) {
		lockVal = "unlocked";
		blurred = "";
		link = "a";
	}
	locationDetails.innerHTML +=
		`<div id="locationElement` +
		number +
		`" onclick="MARKERS[` +
		(number - 1) +
		`].openPopup(MARKERS[` +
		(number - 1) +
		`].getLatLng()); MAP.setView([` +
		coords +
		`], 13)" class="locationElement ` +
		lockVal +
		`">
    <div class="locationElementLeftDiv">
        <!--LHS-->
        <div class="flex" style="margin: 10px">
            <em class="fa-solid fa-lock fa-2xl"></em>
            <em class="fa-solid fa-unlock fa-2xl"></em>
        </div>
    </div>
    <div class="locationElementRightDiv` +
		blurred +
		`">
        <!--RHS-->
        <div style="font-size: 1rem">
            <p>` +
		streetName +
		`</p>
            <!--Name-->
        </div>
        <div style="font-size: 0.75rem">
            <p>` +
		length +
		`m long</p>
            <p>Google Maps: <` +
		link +
		` href='https://www.google.com/maps/dir/` +
		LATITUDE +
		"," +
		LONGITUDE +
		"/" +
		coords[0] +
		"," +
		coords[1] +
		`/'>Directions</` +
		link +
		`></p>
            <!--Google Maps link-->
        </div>
    </div>
</div>`;
}

// https://stackoverflow.com/questions/2499567/how-to-make-a-json-call-to-an-url/2499647#2499647
function GET(jsonUrl) {
	let Httpreq = new XMLHttpRequest(); // a new request
	Httpreq.open("GET", jsonUrl, false);
	Httpreq.send(null);
	return Httpreq.responseText;
}

$(document).ready(function () {
	//gets user location
	navigator.geolocation.getCurrentPosition((position) => {
		LATITUDE = position.coords.latitude;
		LONGITUDE = position.coords.longitude;
	});

	let ajaxInputBikePath = {
		resource_id: "cb86bda2-ad56-46d5-bd7d-305f5e3cbecb",
		limit: 100,
	};

	$.ajax({
		//https://www.data.brisbane.qld.gov.au/data/dataset/bikeway-sections/resource/cb86bda2-ad56-46d5-bd7d-305f5e3cbecb
		url: "https://www.data.brisbane.qld.gov.au/data/api/3/action/datastore_search",
		data: ajaxInputBikePath,
		dataType: "jsonp",
		cache: true,
		success: function (results) {
			//console.log("results.result");
			//console.log(results.result);
			BIKEWAYDATABASE = results.result.records;
			iterateRecords(results);
		},
	});
});

function iterateRecords(results) {
	// https://leafletjs.com/examples/quick-start/
	//sets map up
	let map = L.map("map", { zoomControl: false }).setView([100, 100], 13);
	MAP = map;
	L.control.zoom({ position: "bottomright" }).addTo(map);
	if (LATITUDE != -1 && LONGITUDE != -1) {
		//centers map on user
		map.setView([LATITUDE, LONGITUDE]);
	}

	//add bottom contributions
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);

	// https://stackoverflow.com/questions/2499567/how-to-make-a-json-call-to-an-url/2499647#2499647
	LOCATIONJSON = JSON.parse(GET("js/bikePaths.json"));
	// console.log("LOCATIONJSON");
	// console.log(LOCATIONJSON);

	let workingData = results.result.records;

	//check results came through
	// console.log("workingData");
	// console.log(workingData);

	let locationNumber = 1;
	if (localStorage.getItem("locationNumber") !== null) {
		locationNumber = localStorage.getItem("locationNumber");
	} else {
		localStorage.setItem("locationNumber", locationNumber);
	}

	if (location.href.slice(-1) == "f" || location.href.slice(-2) == "f/") {
		localStorage.setItem("locationNumber", parseInt(locationNumber) + 1);
	}

	let counter = 1; //(going to only get data for and display for unlocked locationNumber)

	let geoJSONStyle = {
		color: "#0a47a8",
		weight: 7,
		opacity: 1,
	};

	// Iterate over each record and add a marker using the Latitude field (also containing longitude)
	$.each(workingData, function (recordID, recordValue) {
		let locationJSONValueObject = -1;
		for (let LOCATIONJSONkey in LOCATIONJSON) {
			if (LOCATIONJSON[LOCATIONJSONkey].properties.OBJECTID == recordValue.OBJECTID) {
				locationJSONValueObject = LOCATIONJSON[LOCATIONJSONkey];
                L.geoJSON(LOCATIONJSON[counter - 1], { style: geoJSONStyle }).addTo(map);
				break;
			}
		}
		let location = recordValue.STREET_NAME + " " + recordValue.SUBURB + " QLD Australia";
		location.replace(" ", "%20");

		let pointLat = locationJSONValueObject.geometry.coordinates[0][1];
		let pointLon = locationJSONValueObject.geometry.coordinates[0][0];

		//if location is unlocked (location number > counter), add location marker to map
		if (counter < parseInt(locationNumber)) {
			console.log(LOCATIONJSON);
			addLocation(counter, true, titleCase(recordValue.STREET_NAME + ", " + recordValue.SUBURB), parseInt(recordValue.SHAPE_Length), [pointLat, pointLon]);

			let popupData =
				"<h3>" +
				titleCase(location) +
				"</h3>" +
				"<p>" +
				titleCase(recordValue.LOCATIONS_DESCRIPTION) +
				", " +
				titleCase(recordValue.TRAFFIC_TYPES_DESCRIPTION) +
				"</p><p><a href='https://www.google.com/maps/dir/" +
				LATITUDE +
				"," +
				LONGITUDE +
				"/" +
				pointLat +
				"," +
				pointLon +
				"/'>Directions</a>";

			// l([pointLat, pointLon]);

			let marker = L.marker([pointLat, pointLon], {
				icon: L.icon({
					iconUrl: "../images/mapIcon.png",
					iconSize: [32, 45],
				}),
				title: titleCase(location),
				riseOnHover: true,
				opacity: 0.9,
				interactive: true,
			})
				.addTo(map)
				//add popup containing popup data.
				.bindPopup(popupData);

			marker.on("mouseover", function (ev) {
				marker.setOpacity(1);
			});

			marker.on("mouseout", function (ev) {
				marker.setOpacity(0.8);
			});

			// console.log("marker");
			// console.log(marker);

			//store markers in case it needs to be used/edited later
			MARKERS[MARKERS.length] = marker;
			console.log("MARKERS");
			console.log(MARKERS);

			//old ajax call location
		} else {
			addLocation(counter, false, titleCase(recordValue.STREET_NAME + ", " + recordValue.SUBURB), parseInt(recordValue.SHAPE_Length), [pointLat, pointLon]);
		}
		counter++;
	});
}

//old ajax call

// $.ajax({
// 	url: "https://api.tomtom.com/search/2/geocode/" + location + ".json?key=NGbWS2r0hGNdCiqFTqJfqCeQkQkg20va",
// 	success: function (results) {
// 		tomtomDATABASE = results;
// 		pointLat = results["results"][0]["position"]["lat"];
// 		pointLon = results["results"][0]["position"]["lon"];
// 		//popup data
// 		let popupData = "<h3>" + location + "</h3>" + "<p>" + recordValue.LOCATIONS_DESCRIPTION + ", " + recordValue.TRAFFIC_TYPES_DESCRIPTION + "</p><p><a href='www.google.com/maps/dir/"+LATITUDE+","+LONGITUDE+"/"+pointLat+","+pointLon+"/'";
// // if (counter <= locationNumber) {
// //marker on at location. Markers rise when hovered.
// let marker = L.marker([pointLat, pointLon], {
// 	icon: L.icon({
// 		iconUrl: "../images/mapIcon.png",
// 		iconSize: [32, 45],
// 	}),
// 	title: location,
// 	riseOnHover: true,
// })
// 	.addTo(map)
// 	//add popup containing popup data.
// 	.bindPopup(popupData);
// //store all markers;
// markers[markers.length] = marker;
// console.log("marker");
// console.log(marker);
// }
// 	},
// });
