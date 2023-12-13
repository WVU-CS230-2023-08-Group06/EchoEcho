
var genreArray = [];
var genreArray = JSON.parse(localStorage.getItem('genre_array')) || [];
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
	genreArray.sort(function(a, b) {
    	return b[1] - a[1];
    });
    console.log(genreArray);
}

function displayGenre() {
    // Assuming you have an HTML element with id "genreList" to display genres
    var genreListElement = document.getElementById('genreList');
    // Clear the existing content in the genreListElement
    genreListElement.innerHTML = '';
    // Display only the top 5 genres
    for (var i = 0; i < Math.min(20, genreArray.length); i++) {
        var listItem = document.createElement('li');
        listItem.textContent = genreArray[i][0] + ' - ' + genreArray[i][1] + ' occurrences';
        genreListElement.appendChild(listItem);
    }
}
