// JavaScript Document

/**Function to log the user out*/
function logout() {
	localStorage.clear();
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com";
}

/**Dynamically displays the user's data using data in localStorage
 * 
 * @param {string} time_range - indicates the time range of the data to be shown
 */
function displayTracks(time_range) {
	//Gets the array corresponding to the selected time range
	if (time_range === 'long_term') {
		var topTracksString = localStorage.getItem('top_tracks');
	} else if (time_range === 'medium_term') {
		var topTracksString = localStorage.getItem('top_tracks_6mo');
	} else {
		var topTracksString = localStorage.getItem('top_tracks_4wk');
	}

	//Ensure that the data existws
	if (topTracksString !== null && typeof topTracksString === "string") {
		console.log(topTracksString);
		var topTracks = JSON.parse(topTracksString);   // deserializing here
		console.log("Succesfully retrieved 'tasks' and contents.");
	} else {
		console.log("An error occurred while retrieving the data");
	}
	
	//Gets the list to print to
	var trackList = document.getElementById('trackList');
	//Reset the list if the time frame is changed
	trackList.innerHTML = '';

	//Create the dynamic list elements
	if (topTracks) {
		topTracks.forEach(function(track) {
			var listItem = document.createElement('li');
			listItem.className = 'trackList';

			//Add track cover
			var trackPicture = document.createElement('img');
			trackPicture.src = track.album.images[0].url;
			trackPicture.className = 'trackImg';

			//Add a link to the track
			var trackLink = document.createElement('a');
			trackLink.href = track.external_urls.spotify;
			trackLink.textContent = track.name;
			trackLink.className = 'trackLinks';
			
			//Append items to the li element
			listItem.appendChild(trackPicture);
			listItem.appendChild(trackLink);
			console.log(track.name);
			trackList.appendChild(listItem);
		});
	}
}

//Executes when page contents have loaded
document.addEventListener('DOMContentLoaded', function () {
	// Add event listener to the radio buttons
	const radioButtons = document.querySelectorAll('input[name="tabs"]');
	radioButtons.forEach(function (radioButton) {
	  radioButton.addEventListener('change', function () {
		// Call the onPageLoad function with the selected time range
		onPageLoad(this.id.replace('radio-', ''));
	  });
	});
  
	// Default call to onPageLoad
	onPageLoad('long');
  });
  
  /**Calls displayTracks with the selected time range
   * 
   * @param {string} timeRange - details the time range for the data
   */
  function onPageLoad(timeRange) {
	switch (timeRange) {
	  case 'long':
		displayTracks('long_term');
		break;
	  case 'med':
		displayTracks('medium_term');
		break;
	  case 'short':
		displayTracks('short_term');
		break;
	  default:
		break;
	}
  }
