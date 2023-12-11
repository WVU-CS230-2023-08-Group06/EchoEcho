// // Authorization token that must have been created previously. See : https://developer.spotify.com/documentation/web-api/concepts/authorization
// //const token = 'BQC_sbQd02yu2_QwaEfnzgvf2DLf2TOIe_p0PdrtBqiCqSJFg7510vP1as9-BXccbJSCDyN5tlbrnAaPpgy78chbh8E2RibWSlioFUHa0qW5yeoI4ZYGxLCH1pNSmsOcUPElD7p5pv7BZJ6z9pAXEYOKSQNrBQjuT0l1fC8dzJB54IKn7M2NDkFd0pk5NFNp16Y--fMEvrMkXgdx2u1BykiMEVLI2hQUqNKkWoIzixjMrX4e0ShE0lI84lq_gRIXAg';
// async function fetchWebApi(endpoint, method, body) {
//   const res = await fetch(`https://api.spotify.com/${endpoint}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     method,
//     body:JSON.stringify(body)
//   });
//   return await res.json();
// }

// async function getTopTracks(){
//   // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
//   return (await fetchWebApi(
//     'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
//   )).items;
// }

// const topTracks = await getTopTracks();
// console.log(
//   topTracks?.map(
//     ({name, artists}) =>
//       `${name} by ${artists.map(artist => artist.name).join(', ')}`
//   )
// );

// const topTracksIds = [
//     '6IyoLWzljeR3ldQo4KWHT6','6kWNMFptUFZE1tlkbRCwav','6gxKUmycQX7uyMwJcweFjp','2Qt8qG9SWPdtRiaWcPNJRm','7JuHVG3qQKQKxC4doneXVW'
//   ];
  
//   async function getRecommendations(){
//     // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
//     return (await fetchWebApi(
//       `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
//     )).tracks;
//   }
  
//   const recommendedTracks = await getRecommendations();
//   console.log(
//     recommendedTracks.map(
//       ({name, artists}) =>
//         `${name} by ${artists.map(artist => artist.name).join(', ')}`
//     )
//   );

async function displayRecommendations() {
  try {
      // Retrieve authentication token and top songs/artists from local storage or any source
      const authToken = localStorage.getItem('auth_token'); // Replace 'auth_token' with your token key
      const topSongsString = localStorage.getItem('top_songs');
      const topArtistsString = localStorage.getItem('top_artists');

      // Ensure the arrays exist and are in the correct format
      if (authToken && typeof topSongsString === 'string' && typeof topArtistsString === 'string') {
          const topSongs = JSON.parse(topSongsString);
          const topArtists = JSON.parse(topArtistsString);

          // Fetch Spotify recommendations
          const recommendations = await getSpotifyRecommendations(authToken, topSongs, topArtists);

          // Get the list element to display recommendations
          const recommendationsList = document.getElementById('recommendationsList');

          // Iterate through the recommendations and display them
          recommendations.forEach(function (track) {
              // Create list element for each recommendation
              const listItem = document.createElement('li');
              listItem.className = 'recommendationItem';

              // Create elements for recommendation details
              const trackName = document.createElement('span');
              trackName.textContent = track.name;
              trackName.className = 'trackName';

              const artistNames = document.createElement('span');
              artistNames.textContent = track.artists.map(artist => artist.name).join(', ');
              artistNames.className = 'artistNames';

              // Append details to the list item
              listItem.appendChild(trackName);
              listItem.appendChild(artistNames);

              // Append the recommendation to the list
              recommendationsList.appendChild(listItem);
          });
      } else {
          console.error('Error: Missing authentication token or top songs/artists data.');
      }
  } catch (error) {
      console.error('Error displaying Spotify recommendations:', error);
  }
}

// Ensure the webpage has loaded before attempting to display recommendations
document.addEventListener('DOMContentLoaded', function () {
  displayRecommendations();
});
