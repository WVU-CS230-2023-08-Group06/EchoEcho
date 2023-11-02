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
		const redirectUri = 'http://127.0.0.1:5500/welcome.html';

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
	let accessToken = localStorage.getItem('access_token');
  
	// Initialize an empty array to store all top artists
	let allArtists = [];
  
	async function fetchTopArtists(offset = 0) {
	  const response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=50&offset=${offset}`, {
		headers: {
		  Authorization: 'Bearer ' + accessToken,
		},
	  });
  
	  const data = await response.json();
	  if (data.items && data.items.length > 0) {
		allArtists = allArtists.concat(data.items);
		// Check for pagination and fetch the next page if available
		if (data.next) {
		  const nextOffset = new URL(data.next).searchParams.get('offset');
		  await fetchTopArtists(nextOffset);
		} else {
			localStorage.setItem('top_artists', JSON.stringify(allArtists));
			let topdbug = localStorage.getItem('top_artists')
		  	console.log(allArtists); // All top artists retrieved
			
		}
	  }
	}
  
	await fetchTopArtists();
  }
		
if (localStorage.getItem('access_token') != null) {
	requestToken();
	getProfile();
	getTopArtists();
}

//Function to get top tracks
// async function getTopTracks() {
// 	let accessToken = localStorage.getItem('access_token');
  
// 	// Initialize an empty array to store all top artists
// 	let allTracks = [];
  
// 	async function fetchTopTracks(offset = 0) {
// 	  const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=20&offset=${offset}`, {
// 		headers: {
// 		  Authorization: 'Bearer ' + accessToken,
// 		},
// 	  });
  
// 	  const data = await response.json();
// 	  if (data.items && data.items.length > 0) {
// 		allTracks = allTracks.concat(data.items);
// 		// Check for pagination and fetch the next page if available
// 		if (data.next) {
// 		  const nextOffset = new URL(data.next).searchParams.get('offset');
// 		  await fetchTopTracks(nextOffset);
// 		} else {
// 			localStorage.setItem('top_tracks', JSON.stringify(allTracks));
// 			let topdbug = localStorage.getItem('top_tracks')
// 		  	console.log(allTracks); // All top tracks retrieved
			
// 		}
// 	  }
// 	}
  
// 	await fetchTopTracks();
//   }
		
// if (localStorage.getItem('access_token') != null) {
// 	requestToken();
// 	getProfile();
// 	getTopTracks();
// }
