require("dotenv").config()
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var keys = require("../liri-node-app/keys");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var getConcerts = function (artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=loann"

    axios.get(queryURL)
        .then(function (response) {
            // handle success
            for (var i = 0; i < 10; i++) {
                console.log("------------------------------------");
                console.log(response.data[i].venue.name);
                console.log(response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("------------------------------------");
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error)
        })
};

var getMovie = function (title) {
    if (!title) {
        title = "mr nobody";
    }

    var queryURL = "http://www.omdbapi.com/?t=" + title + "&apikey=trilogy"

    axios.get(queryURL)
        .then(function (response) {
            // handle success
            console.log("------------------------------------------------------------------------------------------------------------------------------");
            console.log("Title: " + response.data.Title + "\nRelease Year: " + response.data.Year + "\nIMDB Rating: " + response.data.imdbRating + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\nCountry produced: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors);
            console.log("------------------------------------------------------------------------------------------------------------------------------");
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
};

var getSongs = function (tracks) {
    if (!tracks) {
        tracks = "ace of base the sign";
    }

    spotify.search({ type: 'track', query: tracks, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("------------------------------------------------------------------------------------------------------------------------------");
        console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name));
        console.log("Track: " + JSON.stringify(data.tracks.items[0].name));
        console.log("Song Preview URL: " + JSON.stringify(data.tracks.items[0].preview_url));
        console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name));
        console.log("------------------------------------------------------------------------------------------------------------------------------");
    });
};

var run = function (func, argu) {
    if (func === "spotify-this-song") {
        getSongs(argu);
    }
    if (func === "movie-this") {
        getMovie(argu);
    }
    if (func === "concert-this") {
        getConcerts(argu);
    }
}

var random = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");

        run(dataArr[0], dataArr[1]);
    }
    );
};

var command = function (type, userChoice) {
    switch (type) {
        case "concert-this":
            getConcerts(userChoice);
            break;
        case "spotify-this-song":
            getSongs(userChoice);
            break;
        case "movie-this":
            getMovie(userChoice);
            break;
        case "do-what-it-says":
            random();
            break;
        default:
            console.log("Liri does not recognize command.")
    }
};

var runCommand = function (arg1, arg2) {
    command(arg1, arg2);
}

runCommand(process.argv[2], process.argv.slice(3).join(" "))




