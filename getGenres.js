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

function getArtistGenreFromArtists(artistBatch) {
  return fetch("https://api.spotify.com/v1/artists/?ids=" + artistBatch,
    { headers: {'Authorization': 'Bearer ' + token }}
  ).then(function(data) {
    return data.json();
  }).then(function(data) {
    let genreDict = {};
    data.artists.forEach(artist => {
      genreDict = addToGenreDict(artist.genres, genreDict);
    })
    return genreDict;
  });
}

function addToGenreDict(genre, genreDict) {
  genre.forEach(genre => {
    if (genreDict['genre']) {
  genreDict['genre'] += 1;
} else {
  genreDict['genre'] = 1;
}
  });
  return genreDict;
}
