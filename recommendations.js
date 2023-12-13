// JavaScript Document
function logout() {
	localStorage.clear();
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com";
}

// Function to fetch the user's top 5 tracks
async function getTopTracks() {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
    
    const data = await response.json();
    const topTracks = data.items.map(track => track.id);
    
    return topTracks;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
  }
}

// Function to get recommended tracks based on user's top tracks
async function getRecommendedTracks(topTracks) {
  try {
    const seed_tracks = topTracks.join(',');
    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=5&seed_tracks=${seed_tracks}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
    
    const data = await response.json();
    const recommendedTracks = data.tracks.map(track => track.name);
    
    return recommendedTracks;
  } catch (error) {
    console.error('Error fetching recommended tracks:', error);
  }
}

// Usage
async function displayTracks() {
  const topTracks = await getTopTracks();
  
  if (topTracks) {
    console.log('Top 5 tracks:', topTracks);
    
    const recommendedTracks = await getRecommendedTracks(topTracks);
    
    if (recommendedTracks) {
      console.log('Recommended tracks:', recommendedTracks);
      // Display recommended tracks in your desired way (e.g., on a webpage)
    }
  }
}

// Call the function to display tracks
displayTracks();


// Ensure the webpage has loaded before attempting to display recommendations
document.addEventListener('DOMContentLoaded', function () {
  displayRecommendations();
});
