// JavaScript Document
function logout() {
	localStorage.clear();
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com";
}

function displayArtists() {
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
		topArtists.forEach(function(artist) { //for each JSON object in the array of artists
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

//Ensure the webpage has loaded before attempting to display
document.addEventListener('DOMContentLoaded', function () {
	displayArtists();
});