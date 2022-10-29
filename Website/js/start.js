function questionRedirect() {
	//get locationNumber from the url
	let locationNumber = location.href.substring(location.href.indexOf("=") + 1);

	//link to page, adding GET request on the end
	location.href = "Question.html?locationNumber=" + locationNumber;
}
