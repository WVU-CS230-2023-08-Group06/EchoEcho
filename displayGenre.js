// Retrieve genreArray from local storage
var genreArray = JSON.parse(localStorage.getItem('genre_array')) || [];

// Function to create and display the pie chart
function displayGenreChart() {
    // Sort genreArray based on the count (genreArray[i][1]) in descending order
    genreArray.sort(function(a, b) {
        return b[1] - a[1];
    });

    // Get the top 20 genres
    var topGenres = genreArray.slice(0, 20);

    // Extract genre names and counts for the chart
    var genreNames = topGenres.map(function(genre) {
        return genre[0];
    });

    var genreCounts = topGenres.map(function(genre) {
        return genre[1];
    });

    // Assuming element with id "genreChart"
    var ctx = document.getElementById('genreChart').getContext('2d');

    // Create the pie chart
    var pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: genreNames,
            datasets: [{
                data: genreCounts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                ],
            }]
        },
        options: {
            responsive: false, // Ensure responsiveness is turned off
            maintainAspectRatio: false, // Ensure aspect ratio is not maintained
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var genreIndex = tooltipItem.index;
                            return data.labels[genreIndex] + ': ' + data.datasets[0].data[genreIndex] + ' occurrences';
                        }
                    }
                }   
            }
        });
}

// Trigger displayGenreChart when the window is loaded
window.addEventListener('load', displayGenreChart);