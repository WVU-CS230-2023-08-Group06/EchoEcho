// Assuming you have an HTML canvas element with id "genreChart"
var ctx = document.getElementById('genreChart');

// Check if the canvas element is found before proceeding
if (ctx) {
    // Get the parent container of the canvas
    var chartContainer = ctx.parentElement;

    // Create the centered and larger pie chart
    var pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: genreNames, // Assuming genreNames is defined in this scope
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
                    label: function(tooltipItem, data) {
                        var genreIndex = tooltipItem.index;
                        return data.labels[genreIndex] + ': ' + data.datasets[0].data[genreIndex] + ' occurrences';
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

    // Center the chart container
    chartContainer.style.margin = '100px auto'; // Adjust margin as needed
} else {
    console.error('Canvas element with id "genreChart" not found.');
}