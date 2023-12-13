function displayGenre() {
    var genreArray = localStorage.getItem('genre_array');
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
