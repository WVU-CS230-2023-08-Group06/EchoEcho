//Logout functionality for logout button
function logout() {
	localStorage.clear(); // Clears all data saved in localStorage
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com"; // Redirects the user to a specific URL after logout
}

// Function to get recommended tracks based on user's top tracks
async function getRecommendations() {
    let accessToken = localStorage.getItem('access_token'); // Retrieve the access token
    let topTracks = JSON.parse(localStorage.getItem('top_tracks')); // Retrieve the user's top tracks from localStorage

    // Check if topTracks exist and is an array
    if (!topTracks || !Array.isArray(topTracks) || topTracks.length === 0) {
        console.error('No top tracks found.');
        return;
    }

    // Extract track IDs from topTracks
    let trackIds = topTracks.slice(0, 5).map(track => track.id).join(',');

    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=5&seed_tracks=${trackIds}`, {
            headers: {
                Authorization: 'Bearer ' + accessToken, // Include access token in request headers
            },
        });

        const data = await response.json(); // Convert response to JSON
        const recommendedTracks = data.tracks; // Extract recommended tracks
        console.log('Recommended tracks:', recommendedTracks); // Log tracks
        return recommendedTracks;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return null;
    }
}

/*
/ Function to display tracks on webpage
*/
function displayTracksOnPage(tracks) {
    const trackListElement = document.getElementById('recommendedTracksList');

    // Clear existing contents
    trackListElement.innerHTML = '';

    // Iterate through each track and create HTML elements to display
    if (tracks && tracks.length > 0) {
        tracks.forEach(track => {
            const listItem = document.createElement('li');
            listItem.className = 'trackList'; //Add CSS class

            const trackPicture = document.createElement('img');
            trackPicture.src = track.album.images[0].url; //Set image source
            trackPicture.className = 'trackImg'; //CSS class

            const trackLink = document.createElement('a');
            trackLink.href = track.external_urls.spotify; //Set link's href attribute
            trackLink.textContent = track.name; //Set text content of the link to track name
            trackLink.className = 'trackLinks'; //CSS class

            //Append track image and link to list item
            listItem.appendChild(trackPicture);
            listItem.appendChild(trackLink);
            trackListElement.appendChild(listItem);
        });
    } else {
        //If no recommended tracks are found, display error
        const noTracksMessage = document.createElement('p');
        noTracksMessage.textContent = 'No recommended tracks found.';
        trackListElement.appendChild(noTracksMessage);
    }
}

//Usage example
async function displayRecommendations() {
    const recommendedTracks = await getRecommendations();

    if (recommendedTracks) {
        // Display recommended tracks as needed, e.g., on a webpage
        displayTracksOnPage(recommendedTracks); // You can use the previously defined displayTracksOnPage function
    }
}

// Call the function to get and display recommendations
displayRecommendations();