import { genresData } from './getData.js';


console.log(genresData); // This will log the array from getData.js

// Initialize genresCount outside the function
const genresCount = {};

// Function to fetch the user's top artists
async function fetchTopArtists() {
  const accessToken = localStorage.getItem('access_token');
  
  if (!accessToken) {
      console.log('Access token not found. Please authenticate.');
      return;
  }

  try {
      const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      });

      if (!response.ok) {
          console.error('Failed to fetch top artists:', response.status);
          return;
      }

      const data = await response.json();

      
      data.items.forEach(artist => {
          artist.genres.forEach(genre => {
              if (genre in genresCount) {
                  genresCount[genre]++;
              } else {
                  genresCount[genre] = 1;
              }
          });
      });

      console.log('Genres count:', genresCount);

      
      updateGenreChart();
  } catch (error) {
      console.error('Error:', error);
  }
}

// Function to update the genre chart
function updateGenreChart() {
    const ctx = document.getElementById('genreChart').getContext('2d');

    const genreData = {
        labels: Object.keys(genresCount),  // Genre names
        datasets: [{
            data: Object.values(genresCount),  // Genre counts
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                
            ],
        }],
    };

    const genreChart = new Chart(ctx, {
        type: 'pie',
        data: genreData,
    });
}

// Call the function to fetch top artists and genres
fetchTopArtists();
