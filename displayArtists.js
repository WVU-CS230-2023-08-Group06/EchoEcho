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
			listItem.textContent = artist.name;
			console.log(artist.name);
			artistList.appendChild(listItem);
		});
	}
}

document.addEventListener('DOMContentLoaded', function () {
	displayArtists();
});