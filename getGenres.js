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
