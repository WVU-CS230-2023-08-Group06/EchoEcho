// JavaScript Document


function displayGenres() {
	
	var topGenresString = localStorage.getItem('top_genres');
if (topGenresString !== null && typeof topGenresString === "string") {
    console.log(topGenresString);
	var topGenres = JSON.parse(topGenresString);   // deserializing here
    console.log("Succesfully retrieved 'top_genres' and contents.");
}
	
	var artistList = document.getElementById('genreList');
	if (topGenres) {
		topGenres.forEach(function(genre) {
			var listItem = document.createElement('li');
			listItem.textContent = artist.name;
			console.log(genre);
			genreList.appendChild(listItem);
		});
	}
}

document.addEventListener('DOMContentLoaded', function () {
	displayGenres();
});