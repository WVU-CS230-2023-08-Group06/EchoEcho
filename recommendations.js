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
        return null;
    }

    // Extract track IDs from topTracks
    let trackIds = topTracks.map(track => track.id).join(',');

    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=5&seed_tracks=${trackIds}`, {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });

        const data = await response.json();

        if (data && data.tracks && data.tracks.length > 0) {
            const recommendedTracks = data.tracks;
            console.log('Recommended tracks:', recommendedTracks);
            return recommendedTracks;
        } else {
            console.warn('No recommended tracks found. Trying different approach.');
            // If no recommendations were found, try to fetch general recommendations
            return await fetchGeneralRecommendations();
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return null;
    }
}

async function fetchGeneralRecommendations() {
    let accessToken = localStorage.getItem('access_token');

    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=5`, {
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });

        const data = await response.json();

        if (data && data.tracks && data.tracks.length > 0) {
            const recommendedTracks = data.tracks;
            console.log('General recommended tracks:', recommendedTracks);
            return recommendedTracks;
        } else {
            console.error('No general recommended tracks found.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching general recommendations:', error);
        return null;
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
