// Retrieve genreArray from local storage
var genreArray = JSON.parse(localStorage.getItem('genre_array')) || [];

// Function to display the top 20 genres
function displayTopGenres() {
    // Sort genreArray based on the count (genreArray[i][1]) in descending order
    genreArray.sort(function(a, b) {
        return b[1] - a[1];
    });

    // Assuming element with id "genreList" to display genres
    var genreListElement = document.getElementById('genreList');

    // Clear the existing content in the genreListElement
    genreListElement.innerHTML = '';

    // Display only the top 20 genres
    for (var i = 0; i < Math.min(20, genreArray.length); i++) {
        var listItem = document.createElement('li');
        listItem.textContent = genreArray[i][0] + ' - ' + genreArray[i][1] + ' occurrences';
        genreListElement.appendChild(listItem);
    }
}

// Trigger displayTopGenres when the window is loaded
window.addEventListener('load', displayTopGenres);