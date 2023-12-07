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
            
	requestToken();
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
  
	await fetchTopArtists();
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
  
	await fetchTopTracks();
  }
		
if (localStorage.getItem('access_token') != null) {
	requestToken();
	getProfile();
	getTopArtists();
	getTopTracks();
}

let top5Songs = topTracks.slice(0, 5);
let top5Artists = topArtists.slice(0, 5);

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


//********************************getGenre ********************************/
//function rturns artists based on saved artists on the spotify account
//recursively calls itself after an artist is received using spotify's callback url
//returned as a promise
function getArtistsFromSavedTracks(url, setOfArtists) {
  return fetch(url,
    { headers: {'Authorization': 'Bearer ' + token }}
  )
  .then(function(data) {
    return data.json();
  }).then(function(data_json) {
    data_json.items.forEach(track => {
      track.track.artists.forEach(artist => {
        setOfArtists.add(artist.id);
      });
    });

    if (data_json.next) {
      return getArtistsFromSavedTracks(data_json.next, setOfArtists);
    } else {
      return setOfArtists;
    }
  });
}

//After artists are collected from getArtistsFromSavedTracks this function will take some and compares
//how often genres among them are referenced returning these values into a list
function getArtistGenreFromArtists(artistBatch) {
  return fetch("https://api.spotify.com/v1/artists/?ids=" + artistBatch,
    { headers: {'Authorization': 'Bearer ' + token }}
  ).then(function(data) {
    return data.json();
  }).then(function(data) {
    let genreList = {};
    data.artists.forEach(artist => {
      genreList = addToGenreList(artist.genres, genreList);
    })
    return genreList;
  });
}

//this function allows for the adding of those referenced genres to a list where they will get a value that corresponds
//to how often they show up
function addToGenreList(genre, genreList) {
  genre.forEach(genre => {
    if (genreList['genre']) {
  genreList['genre'] += 1;
} else {
  genreList['genre'] = 1;
}
  });
  return genreList;
}
fetch("https://api.spotify.com/v1/me",
    { headers: {'Authorization': 'Bearer ' + token }}
  ).then(function(user) {
  //the return here is a promise that will return a set
    let setOfArtists = new Set();
    return getArtistsFromSavedTracks(
      'https://api.spotify.com/v1/me/tracks',
      setOfArtists
    );
  }).then(function(setOfArtists) {
    let genresPromises = [...setOfArtists]
    .chunk(50)
    .map(artistBatch => getArtistGenreFromArtists(artistBatch));
  //compiling our subset into a batch of sets
    return Promise.all(genresPromises);
  }).then(function(genreList) {
    var flattenedGenreList = genreList.reduce((result, currentObject) => {
      for(var key in currentObject) {
          if (currentObject.hasOwnProperty(key)) {
            result[key] = (result[key] || 0) + currentObject[key];
          }
      }
      return result;
    }, {});
    return flattenedGenreList;
  });
//this function is applied to an array and then applies a chunk size of 50 to it, this way we don't have to convert the array
Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        var that = this;
        return Array(Math.ceil(that.length/chunkSize)).fill().map(function(_,i){
            return that.slice(i*chunkSize,i*chunkSize+chunkSize);
        });
    }
});
//last we will flatten the array by reducing it, iterating through the genres while cutting repeats, when a repeat is cut the value of that genre is incremented
then(function(genreList) {
  var flattenedGenreList = genreList.reduce((result, currentObject) => {
    for(var key in currentObject) {
        if (currentObject.hasOwnProperty(key)) {
          result[key] = (result[key] || 0) + currentObject[key];
        }
    }
    return result;
  }, {});
  return flattenedGenreList;
});

document.addEventListener('load', function () {
	console.log(localStorage.getItem('access_token'))
	if (localStorage.getItem('access_token') !== NULL) {
		console.log("hit")
		window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com/homepage.html"
	}
});