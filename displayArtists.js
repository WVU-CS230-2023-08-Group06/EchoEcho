// JavaScript Document


function displayArtists() {
	
	var topArtistsString = localStorage.getItem('top_artists');
if (topArtistsString !== null && typeof topArtistsString === "string") {
    console.log(topArtistsString);
	var topArtists = JSON.parse(topArtistsString);   // deserializing here
    console.log("Succesfully retrieved 'tasks' and contents.");
}
	
	var artistList = document.getElementById('artistList');
	if (topArtists) {
		topArtists.forEach(function(artist) {
			var listItem = document.createElement('li');
			listItem.className = 'artistList';
			
			var artistPicture = document.createElement('img');
			artistPicture.src = artist.images[0].url;
			artistPicture.className = 'artistImg';

			var artistLink = document.createElement('a');
			artistLink.href = artist.external_urls.spotify;
			artistLink.textContent = artist.name;
			artistLink.className = 'artistLinks';

			/*
			var genre = document.createElement('h2');
			genre.textContent = artist.genres[0];
			genre.className = 'artistGenre';
*/
			
			listItem.appendChild(artistPicture);
			//listItem.appendChild(genre);
			listItem.appendChild(artistLink);
			console.log(artist.name);
			artistList.appendChild(listItem);
		});
	}
}

document.addEventListener('DOMContentLoaded', function () {
	displayArtists();
});