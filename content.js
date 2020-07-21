//apikey=5f66fbfa
//apikey=5f66fbfa

function addIMDBRating(imdbMetaData, name, year, rottenRating) {
	var divId = getDivId(name, year);
	var divEl = document.getElementById(divId);
	var synopsises = document.querySelectorAll(".synopsis");
	console.log(synopsises);

	if (synopsises.length >= 1) {
		var div = document.createElement("div");
		var imdbRatingPresent =
			imdbMetaData && imdbMetaData !== "undefined" && imdbMetaData !== "N/A";
		var imdbVoteCount = null;
		var imdbRating = null;
		var imdbId = null;
		if (imdbRatingPresent) {
			var imdbMetaDataArr = imdbMetaData.split(":");
			imdbRating =
				imdbMetaDataArr[0] != "undefined" ? imdbMetaDataArr[0] : "N/A";
			imdbVoteCount =
				imdbMetaDataArr[1] != "undefined" ? imdbMetaDataArr[1] : "N/A";
			imdbId = imdbMetaDataArr[2] != "undefined" ? imdbMetaDataArr[2] : "N/A";
		}
		var imdbHtml =
			(imdbRating ? imdbRating : "N/A") +
			"/" +
			(imdbVoteCount ? imdbVoteCount : "N/A") +
			" Votes";
		var rottenHtml = rottenRating ? rottenRating : "N/A";
		var divHtml = `<div class="ratings">
	  <div>
		 IMDB : ${imdbHtml}
	  </div>
	  <div>
		  Rotten Tomatos : ${rottenHtml}
	  </div>
	</div>`;
		if (imdbId !== null) {
			imdbHtml = `<a class = "imdbRating" target='_blank' href=https://www.imdb.com/title/${imdbId}>${divHtml}</a>`;
		}
		div.innerHTML = imdbHtml;
		div.className = "imdbRating";
		div.id = divId;

		//Coverting Nodelistto Array
		let arr = Array.from(synopsises);
		console.log(arr[0]);

		//Only those movies should be rated that do not have aready imdb ratingdom elemnt and a div with class supplemental-message
		arr.forEach((item) => {
			if (item.previousSibling) {
				if (
					item.previousSibling.className !== "imdbRating" &&
					item.previousSibling.previousSibling.className !== "imdbRating" &&
					item.previousSibling.className !== "supplemental-message"
				) {
					console.log(item.previousSibling.className);
					item.parentNode.insertBefore(div, item);
				}
			}
		});
	}
}

// OMDb basically contains all IMDb scores in an API format
function getIMDbScore(name, year) {
	const xhr = new XMLHttpRequest();
	const url = `https://www.omdbapi.com/?apikey=c53e54a4&t=${name}&y=${year}${(tomatoes = true)}`;
	console.log(url, "url");
	xhr.open("GET", url);
	xhr.send();
	xhr.onload = (e) => {
		if (xhr.status === 200) {
			var apiResponse = JSON.parse(xhr.responseText);
			console.log(apiResponse, "res");
			var imdbRating = apiResponse["imdbRating"];
			var imdbVoteCount = apiResponse["imdbVotes"];
			var imdbId = apiResponse["imdbID"];
			if (apiResponse.Response == "False" || !apiResponse) {
			} else {
				var rottenRating =
					apiResponse["Ratings"].length >= 2
						? apiResponse["Ratings"][1]["Value"]
						: null;
			}
			var imdbMetaData = imdbRating + ":" + imdbVoteCount + ":" + imdbId;
		}
		addIMDBRating(imdbMetaData, name, year, rottenRating);
	};
}

// Main code
// Allows extension to observe changes to the dom.
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var target = document.querySelector(".mainView");

// Define an observer that looks for a specific change.
var observer = new MutationObserver(function (mutations, observer) {
	if (mutations) {
		getNameandYear();
	}
});

// Define what element should be observed by the observer
observer.observe(target, {
	subtree: true,
	attributes: true,
	childList: true,
	characterData: true,
});

//Function to get name and year for a particular movie
let temp1, temp2;
function getNameandYear() {
	var synopsis = document.querySelectorAll(".jawBone .jawbone-title-link");
	if (synopsis === null) {
		return;
	}
	var logoElement = document.querySelectorAll(
		".jawBone .jawbone-title-link .title"
	);

	if (logoElement.length === 0) return;

	logoElement = logoElement[logoElement.length - 1];

	var title = logoElement.textContent;

	if (title === "")
		title = logoElement.querySelector(".logo").getAttribute("alt");

	var yearElement = document.querySelectorAll(
		".jawBone .jawbone-overview-info .meta .year"
	);

	if (yearElement.length === 0) return;
	var year = yearElement[yearElement.length - 1].textContent;

	if (title != temp1) {
		getIMDbScore(title, year);
	}
	temp1 = title;
	temp2 = year;
}

function getDivId(name, year) {
	var name;
	name = name.replace(/[^a-z0-9\s]/gi, "");
	return name;
}
