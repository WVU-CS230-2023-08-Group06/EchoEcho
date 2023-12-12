// JavaScript Document
function logout() {
	localStorage.clear();
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com";
}

function displayTracks(time_range) {
	if (time_range === 'long_term') {
		var topTracksString = localStorage.getItem('top_tracks');
	} else if (time_range === 'medium_term') {
		var topTracksString = localStorage.getItem('top_tracks_6mo');
	} else {
		var topTracksString = localStorage.getItem('top_tracks_4wk');
	}

	
	if (topTracksString !== null && typeof topTracksString === "string") {
		console.log(topTracksString);
		var topTracks = JSON.parse(topTracksString);   // deserializing here
		console.log("Succesfully retrieved 'tasks' and contents.");
	}
	
	var trackList = document.getElementById('trackList');
	if (topTracks) {
		topTracks.forEach(function(track) {
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

document.addEventListener('DOMContentLoaded', function () {
	displayTracks('long_term');
});