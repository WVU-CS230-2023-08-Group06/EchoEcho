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

    background.onload = function() {
        ctx.drawImage(background, 0, 0);

        // Draw list 1
        ctx.fillStyle = 'White';
        ctx.font = '20px Arial';
        ctx.fillText('Top 5 Artists', 50, 40);
        for (let i = 0; i < fiveArtists.length; i++) {
            ctx.fillText(`${i + 1}. ${fiveArtists[i]}`, 50, 80 + i * 30);
        }

        // Draw list 2
        ctx.fillStyle = 'White';
        ctx.font = '20x Arial';
        ctx.fillText('Top 5 Tracks', 260, 40);
        for (let i = 0; i < fiveTracks.length; i++) {
            ctx.fillText(`${i + 1}. ${fiveTracks[i]}`, 260, 80 + i * 30);
        }
    }

	
    // Create a popup with the canvas image
    const popup = window.open('', 'Top 5 Lists', 'width=500,height=500');
	if (!popup) {
        alert('Popup was blocked! Please allow popups for this website.');
        return;
    }
    popup.document.body.appendChild(canvas);

	// Add Twitter share link
    const twitterLink = popup.document.createElement('a');
    twitterLink.href = 'https://twitter.com/intent/tweet?text=Check%20this%20amazing%20website%20out!&url=https://main.d3ontvtqcgyr6j.amplifyapp.com/';
    twitterLink.target = '_blank';
    const twitterImg = popup.document.createElement('img');
    twitterImg.src = 'twitterX.png'; // Assuming the image is accessible at this path
    twitterImg.alt = 'Share on Twitter';
    twitterLink.appendChild(twitterImg);
    popup.document.body.appendChild(twitterLink);

    // Add Facebook share link
    const facebookLink = popup.document.createElement('a');
    facebookLink.href = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmain.d3ontvtqcgyr6j.amplifyapp.com%2F';
    const facebookImg = popup.document.createElement('img');
    facebookImg.src = 'facebookIcon.png'; // Assuming the image is accessible at this path
    facebookImg.alt = 'Share on Facebook';
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
    console.log(genreArray);
}

