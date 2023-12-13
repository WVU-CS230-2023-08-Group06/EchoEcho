// JavaScript Document
function logout() {
	localStorage.clear();
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com";
}

// Function to get recommended tracks based on user's top tracks
async function getRecommendations() {
    let accessToken = localStorage.getItem('access_token');
    let topTracks = JSON.parse(localStorage.getItem('top_tracks')); // Retrieve the user's top tracks from localStorage

    // Check if topTracks exist and is an array
    if (!topTracks || !Array.isArray(topTracks) || topTracks.length === 0) {
        console.error('No top tracks found.');
        return;
    }

    // Extract track IDs from topTracks
    let trackIds = topTracks.map(track => track.id).join(',');

    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=5&seed_tracks=${trackIds}`, {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });

        console.log(response);

        const data = await response.json();
        const recommendedTracks = data.tracks;
        console.log('Recommended tracks:', recommendedTracks);
        return recommendedTracks;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return null;
    }
}

function displayTracksOnPage(tracks) {
    const trackListElement = document.getElementById('recommendedTracksList');

    // Clear existing contents
    trackListElement.innerHTML = '';

    if (tracks && tracks.length > 0) {
        tracks.forEach(track => {
            const listItem = document.createElement('li');
            listItem.className = 'trackList';

            const trackPicture = document.createElement('img');
            trackPicture.src = track.album.images[0].url;
            trackPicture.className = 'trackImg';

            const trackLink = document.createElement('a');
            trackLink.href = track.external_urls.spotify;
            trackLink.textContent = track.name;
            trackLink.className = 'trackLinks';

            listItem.appendChild(trackPicture);
            listItem.appendChild(trackLink);
            trackListElement.appendChild(listItem);
        });
    } else {
        const noTracksMessage = document.createElement('p');
        noTracksMessage.textContent = 'No recommended tracks found.';
        trackListElement.appendChild(noTracksMessage);
    }
}

// Usage example
async function displayRecommendations() {
    const recommendedTracks = await getRecommendations();

    if (recommendedTracks) {
        // Display recommended tracks as needed, e.g., on a webpage
        displayTracksOnPage(recommendedTracks); // You can use the previously defined displayTracksOnPage function
    }
}

// Call the function to get and display recommendations
displayRecommendations();