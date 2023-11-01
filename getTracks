async function getTopTracks() {
	let accessToken = localStorage.getItem('access_token');
	let allTracks = [];
	  async function fetchTopTracks(offset = 0) {
	    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=20&offset=${offset}`, {
		  headers: {Authorization: 'Bearer ' + accessToken,},});
	  const data = await response.json();
	  if (data.items && data.items.length > 0) {
		  allTracks = allTracks.concat(data.items);
		  if (data.next) {
		    const nextOffset = new URL(data.next).searchParams.get('offset');
		    await fetchTopTracks(nextOffset);
      } 
      else {
		    console.log(allTracks);
		  }
	  }
	}
	await fetchTopTracks();
  }

if (localStorage.getItem('access_token') != null) {
	requestToken();
	getProfile();
	getTopTracks();
}
