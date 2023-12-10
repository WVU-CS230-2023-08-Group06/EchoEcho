// JavaScript Document

var topArtists;
var topTracks;

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
		topArtists = JSON.parse(topArtistsString);   // deserializing here
		console.log("Succesfully retrieved 'tasks' and contents.");
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
			artistList.appendChild(listItem);
		});
	}
}


function displayTracks() {
	
	var topTracksString = localStorage.getItem('top_tracks');
if (topTracksString !== null && typeof topTracksString === "string") {
    console.log(topTracksString);
	topTracks = JSON.parse(topTracksString);   // deserializing here
    console.log("Succesfully retrieved 'tasks' and contents.");
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
			//listItem.appendChild(genre);
			listItem.appendChild(trackLink);
			console.log(track.name);
			trackList.appendChild(listItem);
		});
	}
}


drawTopLists(topTracks, topArtists);
// Function to draw the top 5 lists on the canvas
function drawTopLists(topTracks, topArtists) {

	let fiveTracks = topTracks.slice(0, 5);
	let fiveArtists = topArtists.slice(0, 5);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 300;

    // Define the position to start drawing the first list
    let x1 = 50;
    let y1 = 50;

    // Define the position to start drawing the second list
    let x2 = 250;
    let y2 = 50;

    // Draw list 1
    ctx.fillStyle = 'blue';
    ctx.font = '16px Arial';
    ctx.fillText('Top 5 Artists', x1, y1 - 10);
    for (let i = 0; i < fiveArtists.length; i++) {
        ctx.fillText(`${i + 1}. ${fiveArtists[i]}`, x1, y1 + i * 20);
    }

    // Draw list 2
    ctx.fillStyle = 'green';
    ctx.font = '16px Arial';
    ctx.fillText('Top 5 Tracks', x2, y2 - 10);
    for (let i = 0; i < fiveTracks.length; i++) {
        ctx.fillText(`${i + 1}. ${fiveArtists[i]}`, x2, y2 + i * 20);
    }

    // Create a popup with the canvas image
    const popup = window.open('', 'Top 5 Lists', 'width=400,height=300');
    popup.document.body.appendChild(canvas);
}

document.addEventListener('DOMContentLoaded', function () {
	displayArtists();
	displayTracks();
});

