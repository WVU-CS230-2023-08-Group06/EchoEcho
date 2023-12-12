/*import { Amplify, API, Auth, Storage } from 'aws-amplify';
const awsExports = require('@/aws-exports').default;

Amplify.register(API)
Amplify.register(Storage)
Amplify.register(Auth)
/* Register the services before configure */
/*Amplify.configure(awsExports)
Amplify.configure(awsConfig)*/

function generateRandomString(length) {
  	let text = '';
  	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  	for (let i = 0; i < length; i++) {
    	text += possible.charAt(Math.floor(Math.random() * possible.length));
  	}
  	return text;
}
		
async function generateCodeChallenge(codeVerifier) {
	function base64encode(string) {
    	return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
      	.replace(/\+/g, '-')
      	.replace(/\//g, '_')
      	.replace(/=+$/, '');
  	}

const encoder = new TextEncoder();
const data = encoder.encode(codeVerifier);
const digest = await window.crypto.subtle.digest('SHA-256', data);

return base64encode(digest);
}
		
function requestAuthentication() {
	
	let codeVerifier = generateRandomString(128);

	generateCodeChallenge(codeVerifier).then(codeChallenge => {
		let state = generateRandomString(16);
		let scope = 'user-read-private user-read-email user-top-read';

		localStorage.setItem('code_verifier', codeVerifier);

		let args = new URLSearchParams({
			response_type: 'code',
			client_id: clientId,
			scope: scope,
			redirect_uri: redirectUri, 
			state: state,
			code_challenge_method: 'S256',
			code_challenge: codeChallenge
		});

		window.location = 'https://accounts.spotify.com/authorize?' + args;
	});
}

const clientId = '7820cb5ed08b4ad490fcad0e33712d6e'; //client id is provided by spotify for webapps, but a redirect uri is required to get it
const redirectUri = 'https://main.d3ontvtqcgyr6j.amplifyapp.com/';

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

		const response = fetch('https://accounts.spotify.com/api/token', {
  		method: 'POST',
  		headers: {
    		'Content-Type': 'application/x-www-form-urlencoded'
  		},
  		body: body
	})
 	 .then(response => {
    	if (!response.ok) {
    	  throw new Error('HTTP status ' + response.status);
    	}
    	return response.json();
  	})
  	.then(data => {
    	localStorage.setItem('access_token', data.access_token);
		getTopArtists();
  	})
  	.catch(error => {
    	console.error('Error:', error);
  	});
}

const getRefreshToken = async () => {

	// refresh token that has been previously stored
	const refreshToken = localStorage.getItem('refresh_token');
	const url = "https://accounts.spotify.com/api/token";
 
	 const payload = {
	   method: 'POST',
	   headers: {
		 'Content-Type': 'application/x-www-form-urlencoded'
	   },
	   body: new URLSearchParams({
		 grant_type: 'refresh_token',
		 refresh_token: refreshToken,
		 client_id: clientId
	   }),
	 }
	 body = await fetch(url, payload);
	 const response = await body.json();
 
	 localStorage.setItem('access_token', response.accessToken);
	 localStorage.setItem('refresh_token', response.refreshToken);
   }

async function getProfile() {
	let accessToken = localStorage.getItem('access_token');
  
	const response = await fetch('https://api.spotify.com/v1/me', {
	  headers: {
		Authorization: 'Bearer ' + accessToken
	  }
	});
  
	const data = await response.json();
	console.log(data);
	
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com/homepage.html"
}

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

// Function to get the user's top artists
async function getTopArtists() {
	//fetch access token
	let accessToken = localStorage.getItem('access_token');
  
	// Initialize an empty array to store all top artists
	let allArtists = [];
  
	//Request data from api
	async function fetchTopArtists(offset = 0) {
	  const response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=${offset}`, {
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
			localStorage.setItem('top_artists', JSON.stringify(allArtists));
			let topdbug = localStorage.getItem('top_artists')
		  	console.log(allArtists); // All top artists retrieved
			
		}
	  }
	}
  
	await fetchTopArtists().then(() => {
		getTopTracks();
	});
  }

//version similar to getTopArtists in getData.js
async function getTopTracks() {
	//fetch access token
	let accessToken = localStorage.getItem('access_token');
  
	//Initialize an empty array to store all top tracks
	let allTracks = [];
  
	//Request data from api
	async function fetchTopTracks(offset = 0) {
	  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=20&offset=${offset}`, {
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
			localStorage.setItem('top_tracks', JSON.stringify(allTracks));
			let topdbug = localStorage.getItem('top_tracks')
		  	console.log(allTracks); // All top tracks retrieved
			
		}
	  }
	}
  
	await fetchTopTracks().then(() => {
		getProfile();
	});
  }



//********************************getGenre ********************************/
//function rturns artists based on saved artists on the spotify account
//recursively calls itself after an artist is received using spotify's callback url
//returned as a promise

async function getToken() {
  if (localStorage.getItem("sessionToken") == null) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });
    const tokenResponse = await response.json();
    localStorage.setItem("sessionToken", tokenResponse.access_token);
  }
}

function showLoadingSpinner() {
	document.getElementById("loadingSpinner").style.display = "block";
}

function onPageLoad() {
	var loginBtn = document.getElementById("login");
	var welcomePrompt = document.getElementById("welcomePrompt");
	const queryParams = new URLSearchParams(window.location.search);
	if (queryParams.has('code')) {
		welcomePrompt.textContent = "Just a moment...";
		loginBtn.style.display = "none";
		showLoadingSpinner();
		requestToken();
	}

	

}

let genreArray = [];

function getGenres() {
    var topArtists = localStorage.getItem('top_artists');
    topArtists.array.forEach(artist => {
        var genres = artist.genres;
        for (i in genres) {
            for (j in genreArray) {
                if (genres[i] === genreArray[j][0]) {
                    genreArray[j][1]++;
                    break;
                }
                if (j === genreArray.length - 1) {
                    genreArray[j+1][0] = genres[i];
                    genreArray[j+1][1]++;
                    break;
                }
            }

        }
    });
    console.log(genreArray);
}