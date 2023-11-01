// JavaScript Document


function displayArtists() {
	var topArtists = JSON.parse(localStorage.getItem('top_artists'));
	var artistList = document.getElementById('artistList');
	if (topArtists) {
		topArtists.forEach(function(artist) {
			var listItem = document.createElement('li');
			listItem.textContent = artist.name;
			artistList.appendChild(listItem);
		});
	}
}

document.addEventListener('DOMContentLoaded', function () {
	displayArtists();
});