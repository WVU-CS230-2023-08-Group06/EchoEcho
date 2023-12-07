// JavaScript Document

// Function to get the user's top artists
async function getTopArtists() {
	//fetch access token
	let accessToken = localStorage.getItem('access_token');
  
	// Initialize an empty array to store all top artists
	let allArtists = [];
  
	//Request data from api
	async function fetchTopArtists(offset = 0) {
	  const response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=${offset}`, {
		headers: {
		  Authorization: 'Bearer ' + accessToken,
		},
	  });
  
	  //Store recieved data in JSON format
	  const data = await response.json();
	  if (data.items && data.items.length > 0) {
		allArtists = allArtists.concat(data.items);
		//Check for pagination and fetch the next page if available
		if (data.next) {
		  const nextOffset = new URL(data.next).searchParams.get('offset');
		  await fetchTopArtists(nextOffset);
		} else {
			//Store as a JSON string in local storage when there are no objects left
			localStorage.setItem('top_artists', JSON.stringify(allArtists));
			let topdbug = localStorage.getItem('top_artists')
		  	console.log(allArtists); // All top artists retrieved
			
		}
	  }
	}
  
	await fetchTopArtists();
  }

//version similar to getTopArtists in getData.js
async function getTopTracks() {
	//fetch access token
	let accessToken = localStorage.getItem('access_token');
  
	//Initialize an empty array to store all top tracks
	let allTracks = [];
  
	//Request data from api
	async function fetchTopTracks(offset = 0) {
	  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=20&offset=${offset}`, {
		headers: {
		  Authorization: 'Bearer ' + accessToken,
		},
	  });
  
	  //Store recieved data in JSON format
	  const data = await response.json();
	  if (data.items && data.items.length > 0) {
		allTracks = allTracks.concat(data.items);
		//Check for pagination and fetch the next page if available
		if (data.next) {
		  const nextOffset = new URL(data.next).searchParams.get('offset');
		  await fetchTopTracks(nextOffset);
		} else {
			//Store as a JSON string in local storage when there are no objects left
			localStorage.setItem('top_tracks', JSON.stringify(allTracks));
			let topdbug = localStorage.getItem('top_tracks')
		  	console.log(allTracks); // All top tracks retrieved
			
		}
	  }
	}
  
	await fetchTopTracks();
  }


function displayArtists() {
	console.log(localStorage.getItem('access_token'))
	//get the array of top artists
	var topArtistsString = localStorage.getItem('top_artists');
	//Ensure that the array exists
	if (topArtistsString !== null && typeof topArtistsString === "string") {
		console.log(topArtistsString); //for debugging
		var topArtists = JSON.parse(topArtistsString);   // deserializing here
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
	var topTracks = JSON.parse(topTracksString);   // deserializing here
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

if (localStorage.getItem('access_token') !== null) {
	getTopArtists();
	getTopTracks();
}

document.addEventListener('DOMContentLoaded', function () {
	displayArtists();
	displayTracks();
});