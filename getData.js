const clientId = '7820cb5ed08b4ad490fcad0e33712d6e'; //client id is provided by spotify for webapps, but a redirect uri is required to get it
const redirectUri = 'https://main.d3ontvtqcgyr6j.amplifyapp.com/';


/**Generates a random string for the code challenge code verifier
 * 
 * @param {int} length - decides the length of the random string
 * @returns a random string
 */
function generateRandomString(length) {
  	let text = '';
  	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  	for (let i = 0; i < length; i++) {
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
  	}
  	return text;
}

/**Hashes the code verifier generated to send
 *  as part of the auth request
 * 
 * @param {string} codeVerifier - a random string
 * @returns the hashed code verifier
 */
async function generateCodeChallenge(codeVerifier) {
	function base64encode(string) {
    	return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      	.replace(/\+/g, '-')
      	.replace(/\//g, '_')
      	.replace(/=+$/, '');
  	}
	//Uses SHA-256 to hash codeVerifier
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);

	return base64encode(digest);
}

/**Initiates the auth request via a redirect to spotify login*/
function requestAuthentication() {
	//generate random string
	let codeVerifier = generateRandomString(128);

	//hash the string and pass it to the next body of code to send a request to the api
	generateCodeChallenge(codeVerifier).then(codeChallenge => {
		let state = generateRandomString(16);
		//specifies permissions to be granted
		let scope = 'user-read-private user-read-email user-top-read';

		localStorage.setItem('code_verifier', codeVerifier);

		//set up URL search params
		let args = new URLSearchParams({
			response_type: 'code',
			client_id: clientId,
			scope: scope,
			//redirectUri is where the user will end up after auth
			redirect_uri: redirectUri, 
			state: state,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge
		});
		//Go to spotify login with the above required data
		window.location = 'https://accounts.spotify.com/authorize?' + args;
	});
}

/**Sends a POST request to the spotify token endpoint to get the user's access token*/
function requestToken() {
//parse URL and save code parameter to request access token
	const urlParams = new URLSearchParams(window.location.search);
	let code = urlParams.get('code');
	let codeVerifier = localStorage.getItem('code_verifier');
		let body = new URLSearchParams({
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: redirectUri,
		client_id: clientId,
		code_verifier: codeVerifier
		});

		//make the POST request
		const response = fetch('https://accounts.spotify.com/api/token', {
  		method: 'POST',
  		headers: {
    		'Content-Type': 'application/x-www-form-urlencoded'
  		},
  		body: body
	})
	//Check return status and catch errors
 	 .then(response => {
    	if (!response.ok) {
    	  throw new Error('HTTP status ' + response.status);
    	}
    	return response.json();
  	})
  	.then(data => {
		//If the request was sucessful, store the token and start getting data
    	localStorage.setItem('access_token', data.access_token);
		getTopArtists('long_term');
  	})
  	.catch(error => {
    	console.error('Error:', error);
  	});
}

/**Gets the user's top artists over the time range specified
 * @param {string} time_range - short_term, medium_term, or long_term
*/
async function getTopArtists(time_range) {
	//fetch access token
	let accessToken = localStorage.getItem('access_token');
  
	// Initialize an empty array to store all top artists
	let allArtists = [];
  
	//Request data from api
	async function fetchTopArtists(offset = 0) {
	  const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=50&offset=${offset}`, {
		headers: {
		  Authorization: 'Bearer ' + accessToken,
		},
	  });
  
	  //Store recieved data in JSON format
	  const data = await response.json();
	  if (data.items && data.items.length > 0) {
		allArtists = allArtists.concat(data.items);
		//Check for pagination and fetch the next page if available
		if (data.next) {
		  const nextOffset = new URL(data.next).searchParams.get('offset');
		  await fetchTopArtists(nextOffset);
		} else {
			//Store as a JSON string in local storage when there are no objects left
			if (time_range === 'long_term') {
				localStorage.setItem('top_artists', JSON.stringify(allArtists));
			} else if (time_range === 'medium_term') {
				localStorage.setItem('top_artists_6mo', JSON.stringify(allArtists));
			} else {
				localStorage.setItem('top_artists_4wk', JSON.stringify(allArtists));
			}
	
		  	console.log(allArtists); // All top artists retrieved
		}
	  }
	}
  
	await fetchTopArtists().then(() => {
		//get artists for each time range
		if (time_range === 'long_term') {
			getTopArtists('medium_term');
		} else if (time_range === 'medium_term') {
			getTopArtists('short_term');
		} else {
			//get the user's top tracks after fetching artists
			getTopTracks('long_term');
		}
	});
  }

/**Gets the user's top tracks */
async function getTopTracks(time_range) {
	//fetch access token
	let accessToken = localStorage.getItem('access_token');
  
	//Initialize an empty array to store all top tracks
	let allTracks = [];
  
	//Request data from api
	async function fetchTopTracks(offset = 0) {
	  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=20&offset=${offset}`, {
		headers: {
		  Authorization: 'Bearer ' + accessToken,
		},
	  });
  
	  //Store recieved data in JSON format
	  const data = await response.json();
	  if (data.items && data.items.length > 0) {
		allTracks = allTracks.concat(data.items);
		//Check for pagination and fetch the next page if available
		if (data.next) {
		  const nextOffset = new URL(data.next).searchParams.get('offset');
		  await fetchTopTracks(nextOffset);
		} else {
			//Store as a JSON string in local storage when there are no objects left
			if (time_range === 'long_term') {
				localStorage.setItem('top_tracks', JSON.stringify(allTracks));
			} else if (time_range === 'medium_term') {
				localStorage.setItem('top_tracks', JSON.stringify(allTracks));
			} else {
				localStorage.setItem('top_tracks', JSON.stringify(allTracks));
			}
			
		  	console.log(allTracks); // All top tracks retrieved
			
		}
	  }
	}
  
	await fetchTopTracks().then(() => {
		//get tracks for each time range
		if (time_range === 'long_term') {
			getTopTracks('medium_term');
		} else if (time_range === 'medium_term') {
			getTopTracks('short_term');
		} else {
			//get the user's profile after fetching tracks
			getProfile();
		}
	});
}

/**Gets the user's spotify recommended songs from the api */
async function getSpotifyRecommendations(authToken, topSongs, topArtists) {
    try {
        // Spotify API endpoint for getting recommendations
        const endpoint = 'https://api.spotify.com/v1/recommendations';

        // Constructing query parameters
        // Note: The Spotify API may require specific parameter formatting or additional parameters
        const queryParams = new URLSearchParams({
            seed_tracks: topSongs.join(','), // Assuming topSongs is an array of track IDs
            seed_artists: topArtists.join(','), // Assuming topArtists is an array of artist IDs
        });

        // Making the API request
        const response = await fetch(`${endpoint}?${queryParams}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Checking if the response is successful
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Parsing the response body as JSON
        const data = await response.json();

        // Return the recommendations from the response
        // The structure of 'data' depends on Spotify's response format
        return data.tracks; // This is an example, adjust based on actual response structure
    } catch (error) {
        console.error('Error fetching Spotify recommendations:', error);
        return [];
    }
}
  
/**Fetches the user's profile from the api */
async function getProfile() {
	let accessToken = localStorage.getItem('access_token');
	
	//Make the api request
	const response = await fetch('https://api.spotify.com/v1/me', {
	  headers: {
		Authorization: 'Bearer ' + accessToken
	  }
	});
  
	const data = await response.json();
	console.log(data);
	localStorage.setItem("user_profile", data);
	//This is the last function in the authorization sequence
	//Sends the user to homepage to view their data
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com/homepage.html"
}

  /**Shows the loading spinner on the welcome page */
function showLoadingSpinner() {
	document.getElementById("loadingSpinner").style.display = "block";
}

/**Checks for an auth code after the page loads, then takes appropriate action */
function onPageLoad() {
	//Get elements to change the page if the user has authenticated
	var loginBtn = document.getElementById("login");
	var welcomePrompt = document.getElementById("welcomePrompt");
	const queryParams = new URLSearchParams(window.location.search);
	//If the URL has the authorization code from spotify authentication,
	if (queryParams.has('code')) {
		//Give the user something pretty to look at
		welcomePrompt.textContent = "Just a moment...";
		loginBtn.style.display = "none";
		showLoadingSpinner();
		//Begin the access token/data fetching process
		requestToken();
	}
}
