//apikey=5f66fbfa

function addDiv(id, imdbScore, numberOfVotes, rottenRating) {
  const elements = document.querySelector(".bob-title");
  var count = 0;
  if (count === 0) {
    // Styling the div to be red, circluar, and have large white text.
    const div = document.createElement("div");
    div.style.width = "80px";
    div.style.height = "80px";
    div.style.borderRadius = "50%";
    div.style.background = "red";
    div.style.color = "white";
    div.style.verticalAlign = "center";
    div.style.textAlign = "center";
    div.style.fontSize = "50px";
    div.innerHTML = imdbScore;
    div.id = id;

    // Makes sure that we only add the div once.
    if (!document.getElementById(id)) {
      elements && elements.appendChild(div);
    }
    count++;
  }
}

function addIMDBRating(imdbMetaData, name, year, rottenRating) {
  var divId = getDivId(name, year);
  var divEl = document.getElementById(divId);

  if (
    divEl &&
    (divEl.offsetWidth || divEl.offsetHeight || divEl.getClientRects().length)
  ) {
    return;
  }

  var synopsises = document.querySelectorAll(".jawBone .synopsis");
  if (synopsises.length) {
    var synopsis = synopsises[synopsises.length - 1];
    var div = document.createElement("div");

    var imdbRatingPresent =
      imdbMetaData && imdbMetaData !== "undefined" && imdbMetaData !== "N/A";
    var imdbVoteCount = null;
    var imdbRating = null;
    var imdbId = null;
    if (imdbRatingPresent) {
      var imdbMetaDataArr = imdbMetaData.split(":");
      imdbRating = imdbMetaDataArr[0];
      imdbVoteCount = imdbMetaDataArr[1];
      imdbId = imdbMetaDataArr[2];
    }
    var imdbHtml =
      "IMDb : " +
      (imdbRatingPresent ? imdbRating : "N/A") +
      "<br/>" +
      (imdbVoteCount ? " Votes : " + imdbVoteCount : "");
    var rottenHtml = rottenRating
      ? "Rotten Tomatoes : " + rottenRating
      : "Rotten Tomatoes : N/A";

    if (imdbId !== null) {
      imdbHtml =
        "<a class = 'imdbRating' target='_blank' href='https://www.imdb.com/title/" +
        imdbId +
        "'>" +
        imdbHtml +
        "<br/>" +
        rottenHtml;
      ("</a>");
    }

    div.innerHTML = imdbHtml;
    div.id = divId;
    synopsis.parentNode.insertBefore(div, synopsis);
  }
}

// OMDb basically contains all IMDb scores in an API format
function getIMDbScore(name, year) {
  const xhr = new XMLHttpRequest();
  const url = `https://www.omdbapi.com/?apikey=c53e54a4&t=${name}&y=${year}${(tomatoes = true)}`;
  xhr.open("GET", url);
  xhr.send();
  xhr.onload = (e) => {
    if (xhr.status === 200) {
      var apiResponse = JSON.parse(xhr.responseText);
      console.log(apiResponse, "res");
      var imdbRating = apiResponse["imdbRating"];
      var imdbVoteCount = apiResponse["imdbVotes"];
      var imdbId = apiResponse["imdbID"];
      var rottenRating =
        apiResponse["Ratings"].length == 2
          ? apiResponse["Ratings"][1]["Value"]
          : null;
      var imdbMetaData = imdbRating + ":" + imdbVoteCount + ":" + imdbId;
    }
    imdbRating ? addIMDBRating(imdbMetaData, name, year, rottenRating) : "";
    // rottenRating ? addRottenRating(rottenRating, name, year) : "";
  };
}

// Main code
// Allows extension to observe changes to the dom.
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var target = document.querySelector(".mainView");

// Define an observer that looks for a specific change.
var observer = new MutationObserver(function (mutations, observer) {
  if (mutations) {
    window.setTimeout(getNameandYear, 500);
  }
});

// Define what element should be observed by the observer
observer.observe(target, {
  subtree: true,
  attributes: true,
  childList: true,
  characterData: true,
});

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
  var divId = getDivId(title, year);
  var divEl = document.getElementById(divId);

  if (divId != temp1 && year != temp2) {
    getIMDbScore(divId, year);
  }
  temp1 = divId;
  temp2 = year;
}

function getDivId(name, year) {
  var name;
  name = name.replace(/[^a-z0-9\s]/gi, "");
  return name;
}
