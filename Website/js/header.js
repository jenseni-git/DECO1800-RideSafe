let homeLink = "http://127.0.0.1:5500";
let decoHomeLink = "https://deco1800teams-hydra.uqcloud.net";
let indexLink = "/index.html";
let featuresLink = "/features.html";
let quickQuizLink = "/quick-quiz.html";
let aboutUsLink = "/about-us.html";
let mapLink = "/map.html";
let startLink = "/start.html";

let currentLink = location.href;

let icon = `<div id="headerImage" class="">
    <a href="../">
        <img class="big-logo" alt="Ride Safe" src="../images/logoLarge-removebg.png" />
        <img class="small-logo" alt="Ride Safe" src="../images/logoSmall-removebg.png" />
    </a>
</div>
`;
let headerLinks = `<div id="headerLinks" class="flex">
    <div class="col site-link">
        <a id="homeHeader" href="../">Home</a>
    </div>
    <div class="col site-link">
        <a id="mapHeader" href="../map.html">Map</a>
    </div>
    <div class="col site-link">
        <a id="quizHeader" href="../quick-quiz.html">Quick Quiz</a>
    </div>
    <div class="col site-link">
        <a id="aboutUsHeader" href="../about-us.html">About Us</a>
    </div>
</div>
`;

let headerHTML =
	`<div class="header">
    <div class="flex header-content">` +
	icon +
	headerLinks +
	`<div>
            <button onclick="location.href='/map.html'">Try Now&nbsp;></button>
        </div>
    </div>
</div>`;

let headerLightButtonHTML =
	`<div class="header">
    <div class="flex header-content">` +
	icon +
	headerLinks +
	`<div>
            <button onclick="location.href='/map.html'" class="btn-light">Back to map&nbsp;></button>
        </div>
    </div>
</div>`;

let headerNoButtonHTML =
	`<div class="header">
    <div class="flex header-content">` +
	icon +
	headerLinks +
	`<div style="min-width: 110px;">
        </div>
    </div>
</div>`;

if (currentLink.includes(quickQuizLink)) {
	document.write(headerHTML);
	document.getElementById("quizHeader").classList.add("currentWebpage");
} else if (currentLink.includes(startLink)) {
	document.write(headerNoButtonHTML);
} else if (currentLink.includes(aboutUsLink)) {
	document.write(headerHTML);
	document.getElementById("aboutUsHeader").classList.add("currentWebpage");
} else if (currentLink.includes(mapLink)) {
	document.write(headerNoButtonHTML);
	document.getElementById("mapHeader").classList.add("currentWebpage");
} else if (currentLink.includes(indexLink) || currentLink == homeLink || currentLink == homeLink + "/" || currentLink == decoHomeLink || currentLink == decoHomeLink + "/") {
	document.write(headerHTML);
	document.getElementById("homeHeader").classList.add("currentWebpage");
} else {
	document.write(headerLightButtonHTML);
}

// document.write(`<div class="header">
//     <div class="row header-content justify-content-between">
//         <div class="col">
//             <a href="index.html">
//                 <img src="images/logoLarge-removebg.png" alt="Ride Safe" height="100vh" />
//             </a>
//         </div>
//         <div class="col justify-content-flex-end">
//             <button id="explore" onclick="location.href='map.html'">Explore</button>
//         </div>
//     </div>
// </div>`);
