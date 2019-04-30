var watchList = [];
var filteredWatchList = [];

function createWatchList(watchList) {
    watchList.forEach(function (episode) {
        if (!episode.watched) {
            var setWatchedButton = $("<button>")
                .text("Watched")
                .addClass("btn waves-effect black setWatchedButton")
                .attr("data-showName", episode.showName)
                .attr("data-seasonNumber", episode.seasonNumber)
                .attr("data-episodeNumber", episode.episodeNumber);
            var descriptionP = $("<p>")
                .text(episode.description);
            var closeIcon = $("<i>")
                .addClass("material-icons right")
                .text("close");
            var cardSpan = $("<span>")
                .addClass("card-title")
                .append(closeIcon);
            var cardRevealDiv = $("<div>")
                .addClass("card-reveal")
                .append(cardSpan, descriptionP);
            var moreIcon = $("<i>")
                .addClass("material-icons right")
                .text("more_vert");
            var cardSpan = $("<span>")
                .addClass("card-title")
                .text(episode.showName + " (" + episode.network + ") Season "
                    + episode.seasonNumber + " " + " Episode " + episode.episodeNumber)
                .append(moreIcon);
            var cardContentDiv = $("<div>")
                .addClass("card-content activator grey-text text-darken-4")
                .append(cardSpan, setWatchedButton);
            var cardDiv = $("<div>")
                .addClass("card")
                .append(cardContentDiv, cardRevealDiv);
            $("#episodeList").append(cardDiv);
        }
    });
}

function initializeShowSelector() {
    var showList = [];
    $("#showSelector").empty();
    watchList.forEach(function (episode) {
        if (showList.indexOf(episode.showName) == -1) {
            showList.push(episode.showName);
            var option = $("<option>")
                .attr("value", episode.showName)
                .text(episode.showName);
            $("#showSelector").append(option);
        }
    });
    console.log("ShowList", showList);
}

function newUserDataCallback(snapshot) {
    var response = snapshot.val();
    $("#episodeList").empty();
    if (response !== null) {
        if (response.watchList !== undefined) {
            $("#episodeList").empty();
            watchList = response.watchList;
            initializeShowSelector();
            $('select').formSelect();
            filteredWatchList = filterWatchList(watchList, $("#showSelector").val());
            createWatchList(filteredWatchList);
            if (filteredWatchList.length > 0) {
                console.log("Series Poster URL: ", filteredWatchList[0].poster);
                $("#episodeImage").attr("src", filteredWatchList[0].poster);
            }
        }
    }
}

function findEpisode(showName, seasonNumber, episodeNumber) {
    for (var i = 0; i < watchList.length; i++) {
        var myEpisode = watchList[i];
        if (myEpisode.showName === showName) {
            if (myEpisode.seasonNumber == seasonNumber) {
                if (myEpisode.episodeNumber == episodeNumber) {
                    return myEpisode;
                }
            }
        }
    }

    return null;
}

function setWatchedButtonClicked(event) {
    console.log("setWatchedButtonClicked");
    console.log(this);
    var showName = $(this).attr("data-showName");
    var seasonNumber = $(this).attr("data-seasonNumber");
    var episodeNumber = $(this).attr("data-episodeNumber");
    var episode = findEpisode(showName, seasonNumber, episodeNumber);
    if (episode !== null) {
        console.log("Episode found");
        episode.watched = true;
        saveWatchList(watchList);
    }
}

function filterWatchList(watchList, showName) {
    var filtered = [];
    watchList.forEach(function (episode) {
        if (episode.showName == showName) {
            filtered.push(episode);
        }
    });
    return filtered;
}

function showSelectorChanged(event) {
    var showName = event.target.value;
    filteredWatchList = filterWatchList(watchList, showName);
    $("#episodeList").empty();
    createWatchList(filteredWatchList);
    if (filteredWatchList.length > 0) {
        $("#episodeImage").attr("src", filteredWatchList[0].poster);
    }
}

$(function () {
    initializeFirebase();
    setUserName();

    $(document).on("click", ".setWatchedButton", setWatchedButtonClicked);
    $(document).on("change", "#showSelector", showSelectorChanged)
    userDataRef.on("value", newUserDataCallback);
})