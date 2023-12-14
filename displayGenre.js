console.log('Script executed');
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve genre data from local storage
    var genreArray = JSON.parse(localStorage.getItem('genre_array')) || [];

    // Extract genre names and counts from the array, grabbing the genre's name here
    var genreNames = genreArray.slice(0, 20).map(function (entry) {
        return entry[0];
    });
    //grabbing the genre's "weight" here
    var genreCounts = genreArray.slice(0, 20).map(function (entry) {
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
                    ],
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins:{
                    //turning of the legend display for visibility
                    legend: {
                        display: false
                    }
                },
                tooltips: {
                    callbacks: {
                        //setting up hover features
                        label: function (tooltipItem, data) {
                            var genreIndex = tooltipItem.index;
                            return genreNames[genreIndex] + ': ' + genreCounts[genreIndex] + ' occurrences';
                        }
                    }
                },
                //fixing ratios here
                layout: {
                    padding: {
                        left: 100,
                        right: 100,
                        top: 100,
                        bottom: 100,
                    }
                },
            } 
        });
        //if the chart isnt found after generation throw error to console
    } else {
        console.error('Canvas element with id "genreChart" not found.');
    }
});