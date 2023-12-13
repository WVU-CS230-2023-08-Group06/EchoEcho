function displayGenre(){
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve genre data from local storage
    var genreArray = JSON.parse(localStorage.getItem('genre_array')) || [];

    // Extract genre names and counts from the array
    var genreNames = genreArray.map(function (entry) {
        return entry[0];
    });

    var genreCounts = genreArray.map(function (entry) {
        return entry[1];
    });

    // Assuming element with id "genreChart"
    var ctx = document.getElementById('genreChart');
    console.log(ctx);
    // Check if the canvas element is found before proceeding
    if (ctx) {
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
                        // Add more colors as needed
                    ],
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: {
                        label: function (tooltipItem, data) {
                            var genreIndex = tooltipItem.index;
                            return genreNames[genreIndex] + ': ' + genreCounts[genreIndex] + ' occurrences';
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 50,
                        right: 50,
                        top: 50,
                        bottom: 50,
                    }
                },
            }
        });
    } else {
        console.error('Canvas element with id "genreChart" not found.');
    }
});
}