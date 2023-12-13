// Assuming you have an HTML canvas element with id "genreChart"
var ctx = document.getElementById('genreChart').getContext('2d');

document.addEventListener('DOMContentLoaded', function() {
// Create the centered pie chart
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
});