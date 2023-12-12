function displayGenre() {
    // Sort genreArray based on the count (genreArray[i][1]) in descending order
    genreArray.sort(function(a, b) {
        return b[1] - a[1];
    });
    var genreListElement = document.getElementById('genreList');
    // Clear the existing content in the genreListElement
    genreListElement.innerHTML = '';
    // Iterate through the sorted genreArray and display each genre
    genreArray.forEach(function(genre) {
        var listItem = document.createElement('li');
        listItem.textContent = genre[0] + ' - ' + genre[1] + ' occurrences';
        genreListElement.appendChild(listItem);
    });
}
// Call displayGenre after calling getGenres
// You should call displayGenre after the data is ready to be displayed
// Assuming you have an HTML button with id "displayButton" to trigger the display
document.addEventListener('DOMContentLoaded', function () {
	getGenres();
	displayTracks();
});
