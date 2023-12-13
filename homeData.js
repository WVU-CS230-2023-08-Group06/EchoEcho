// JavaScript Document

let fiveArtists = [];
let fiveTracks = [];

function logout() {
	localStorage.clear();
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com";
}

function displayArtists() {
	console.log(localStorage.getItem('access_token'))
	//get the array of top artists
	var topArtistsString = localStorage.getItem('top_artists');
	//Ensure that the array exists
	if (topArtistsString !== null && typeof topArtistsString === "string") {
		console.log(topArtistsString); //for debugging
		var topArtists = JSON.parse(topArtistsString);   // deserializing here
		console.log("Succesfully retrieved artists.");
	}
	
	//get the list element from topArtistsPage
	var artistList = document.getElementById('artistList');
	if (topArtists) {
		topArtists.slice(0, 5).forEach(function(artist) { //for each JSON object in the array of artists
			//Create the list element
			var listItem = document.createElement('li');
			listItem.className = 'artistList';
			
			//Add artist profile picture
			var artistPicture = document.createElement('img');
			artistPicture.src = artist.images[0].url;
			artistPicture.className = 'artistImg';

			//Create a link to the artist's page
			var artistLink = document.createElement('a');
			artistLink.href = artist.external_urls.spotify;
			artistLink.textContent = artist.name;
			artistLink.className = 'artistLinks';
			
			//Append components to list
			listItem.appendChild(artistPicture);
			//listItem.appendChild(genre);
			listItem.appendChild(artistLink);
			console.log(artist.name);
			fiveArtists.push(artist.name);
			artistList.appendChild(listItem);
		});
	}
}


function displayTracks() {
	
	var topTracksString = localStorage.getItem('top_tracks');
if (topTracksString !== null && typeof topTracksString === "string") {
    console.log(topTracksString);
	var topTracks = JSON.parse(topTracksString);   // deserializing here
    console.log("Succesfully retrieved tracks.");
}
	
	var trackList = document.getElementById('trackList');
	if (topTracks) {
		topTracks.slice(0, 5).forEach(function(track) {
			var listItem = document.createElement('li');
			listItem.className = 'trackList';
			
			var trackPicture = document.createElement('img');
			trackPicture.src = track.album.images[0].url;
			trackPicture.className = 'trackImg';

			var trackLink = document.createElement('a');
			trackLink.href = track.external_urls.spotify;
			trackLink.textContent = track.name;
			trackLink.className = 'trackLinks';
			
			listItem.appendChild(trackPicture);
			listItem.appendChild(trackLink);
			console.log(track.name);
			fiveTracks.push(track.name);
			trackList.appendChild(listItem);
		});
	}
}

// Function to draw the top 5 lists on the canvas
function drawTopLists() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 500;
    canvas.height = 500;

    var background = new Image();
    background.src = "/sharingBackground.png";

    // Function to draw centered text
    function drawCenteredText(text, x, y) {
        const textWidth = ctx.measureText(text).width;
        const centeredX = x - (textWidth / 2);
        ctx.fillText(text, centeredX, y);
    }

    background.onload = function() {
        ctx.drawImage(background, 0, 0);

        ctx.fillStyle = 'White';
        ctx.font = '20px Arial';

        // Draw list 1 - Top 5 Artists
        const title1 = 'Top 5 Artists';
        drawCenteredText(title1, canvas.width / 2, 40);
        for (let i = 0; i < fiveArtists.length; i++) {
            drawCenteredText(`${i + 1}. ${fiveArtists[i]}`, canvas.width / 2, 70 + i * 30);
        }

        // Calculate the starting position for list 2, depending on the length of list 1
        let list2StartY = 70 + fiveArtists.length * 30 + 30;

        // Draw list 2 - Top 5 Tracks
        const title2 = 'Top 5 Tracks';
        drawCenteredText(title2, canvas.width / 2, list2StartY);
        for (let i = 0; i < fiveTracks.length; i++) {
            drawCenteredText(`${i + 1}. ${fiveTracks[i]}`, canvas.width / 2, list2StartY + 30 + i * 30);
        }
    };

    // Create a popup with the canvas image
    const popup = window.open('', 'Top 5 Lists', 'width=530,height=650');
    if (!popup) {
        alert('Popup was blocked! Please allow popups for this website.');
        return;
    }
    popup.document.body.appendChild(canvas);

    // Add instructions for saving and sharing
    const instructions = popup.document.createElement('p');
    instructions.textContent = 'Right-click on the image to save it to your device. Share it with your friends using the links below!';
    instructions.style = 'text-align: center; margin-top: 20px;';
    popup.document.body.appendChild(instructions);

    // Add Twitter share link
    const twitterLink = popup.document.createElement('a');
    twitterLink.href = 'https://twitter.com/intent/tweet?text=Check%20this%20amazing%20website%20out!&url=https://main.d3ontvtqcgyr6j.amplifyapp.com/';
    twitterLink.target = '_blank';
    const twitterImg = popup.document.createElement('img');
    twitterImg.src = 'twitterX.png';
    twitterImg.alt = 'Share on Twitter';
    twitterImg.style = 'margin: 10px;';
    twitterLink.appendChild(twitterImg);
    popup.document.body.appendChild(twitterLink);

    // Add Facebook share link
    const facebookLink = popup.document.createElement('a');
    facebookLink.href = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmain.d3ontvtqcgyr6j.amplifyapp.com%2F';
    facebookLink.target = '_blank';
    const facebookImg = popup.document.createElement('img');
    facebookImg.src = 'facebookIcon.png';
    facebookImg.alt = 'Share on Facebook';
    facebookImg.style = 'margin: 10px;';
    facebookLink.appendChild(facebookImg);
    popup.document.body.appendChild(facebookLink);
}


document.addEventListener('DOMContentLoaded', function () {
	displayArtists();
	displayTracks();
	getGenres();
});

var genreArray = [];
function getGenres() {
    var topArtistString = localStorage.getItem('top_artists');
	if (topArtistString !== null && typeof topArtistString === "string") {
		var topArtists = JSON.parse(topArtistString);   // deserializing here
		console.log("Succesfully retrieved artists.");
	}
    topArtists.forEach(function(artist) {
        var genres = artist.genres;
        for (i in genres) {
            var found = false;
            for (var j in genreArray) {
                if (genres[i] === genreArray[j][0]) {
                    genreArray[j][1]++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                genreArray.push([genres[i], 1]);
            }
        }
    });
	genreArray.sort(function(a, b) {
    	return b[1] - a[1];
    });
	localStorage.setItem('genre_array', genreArray);
    console.log(genreArray);
}

// Assuming genreArray is available locally, either defined in another script or fetched from local storage
// var genreArray = [ ['Genre1', 10], ['Genre2', 8], ['Genre3', 6], ['Genre4', 5], ['Genre5', 4] ];
// Function to display the top 5 genres
function displayTopGenres() {
    // Assuming you have an HTML element with id "genreList" to display genres
    var genreListElement = document.getElementById('genreList');
    // Clear the existing content in the genreListElement
    genreListElement.innerHTML = '';
    // Display only the top 5 genres
    for (var i = 0; i < Math.min(5, genreArray.length); i++) {
        var listItem = document.createElement('li');
        listItem.className = 'genreList';
        listItem.textContent = genreArray[i][0] + '\n' + genreArray[i][1] + ' artists';
        listItem.style.whiteSpace = 'pre-line';
        genreListElement.appendChild(listItem);
    }
}

// Trigger displayTopGenres when the window is loaded
window.addEventListener('load', displayTopGenres);
