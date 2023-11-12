//function rturns artists based on saved artists on the potify account
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
