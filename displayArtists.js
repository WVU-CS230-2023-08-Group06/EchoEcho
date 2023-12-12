// JavaScript Document
function logout() {
	localStorage.clear();
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com";
}

function displayArtists(time_range) {
	//get the array of top artists
	if (time_range === 'long_term') {
		var topArtistsString = localStorage.getItem('top_artists');
	} else if (time_range === 'medium_term') {
		var topArtistsString = localStorage.getItem('top_artists_6mo');
	} else {
		var topArtistsString = localStorage.getItem('top_artists_4wk');
	}
	
	
	//Ensure that the array exists
	if (topArtistsString !== null && typeof topArtistsString === "string") {
		console.log(topArtistsString); //for debugging
		var topArtists = JSON.parse(topArtistsString);   // deserializing here
		console.log("Succesfully retrieved 'tasks' and contents.");
	}
	
	//get the list element from topArtistsPage
	var artistList = document.getElementById('artistList');

	// Clear existing list content
	artistList.innerHTML = '';

	if (topArtists) {
		topArtists.forEach(function(artist) { //for each JSON object in the array of artists
			//Create the list element
			var listItem = document.createElement('li');
			listItem.className = 'artistList';
			
			//Add artist profile picture
			var artistPicture = document.createElement('img');
			artistPicture.src = artist.images[0].url;
			artistPicture.className = 'artistImg';

			//Create a link to the artist's page
			var artistLink = document.createElement('a');
			artistLink.href = artist.external_urls.spotify;
			artistLink.textContent = artist.name;
			artistLink.className = 'artistLinks';
			
			//Append components to list
			listItem.appendChild(artistPicture);
			//listItem.appendChild(genre);
			listItem.appendChild(artistLink);
			console.log(artist.name);
			artistList.appendChild(listItem);
		});
	}
}

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
  
  function onPageLoad(timeRange) {
	switch (timeRange) {
	  case 'long':
		displayArtists('long_term');
		break;
	  case 'med':
		displayArtists('medium_term');
		break;
	  case 'short':
		displayArtists('short_term');
		break;
	  default:
		break;
	}
  }
