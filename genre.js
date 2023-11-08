// JavaScript Document

function displayGenres() {
    var topGenresString = localStorage.getItem('top_genres');
    
    if (topGenresString !== null && typeof topGenresString === "string") {
        var topGenres = JSON.parse(topGenresString);
        console.log("Successfully retrieved 'top_genres' and contents.");
    }

    var genreList = document.getElementById('genreList');
    
    if (topGenres) {
        topGenres.forEach(function (genre) {
            var listItem = document.createElement('li');
            listItem.textContent = genre;
            console.log(genre);
            genreList.appendChild(listItem);
        });
    }

    // Create the pie chart here
    if (topGenres) {
        const ctx = document.getElementById('genreChart').getContext('2d');

        const genreData = {
            labels: topGenres, // Genre names
            datasets: [{
                data: Array(topGenres.length).fill(1), // Assuming each genre has a count of 1
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    // Add more colors as needed
                ],
            }],
        };

        const genreChart = new Chart(ctx, {
            type: 'pie',
            data: genreData,
        });
    }
}

// Call the function to display genres
document.addEventListener('DOMContentLoaded', function () {
    displayGenres();
});
