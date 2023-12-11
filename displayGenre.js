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
	var genreList = document.getElementById('genreList');
	if (topArtists) {
		topArtists.forEach(function(artist) { //for each JSON object in the array of artists
			//Create the list element for the genre
			var listItem = document.createElement('li');
			listItem.className = 'genreList';
			console.log(artist.genre)
			genreList.appendChild(listItem);
        })
    }
}
