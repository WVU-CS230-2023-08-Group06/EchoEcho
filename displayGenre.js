// JavaScript Document
function logout() {
	localStorage.clear();
	window.location.href = "https://main.d3ontvtqcgyr6j.amplifyapp.com";
}
function displayGenres() {
    var topGenresString = getGenres();
    var topGenres = JSON.parse(topGenresString);
    console.log("successfully retreived 'tasks' and contents.");

    if(getGenre != null){
        topGenres.forEach(function(genre){
            var listItem = document.createElement('li');
            listItem.className = 'genreList';

            console.log(genre.name);
	trackList.appendChild(listItem);
        })
    }

    document.addEventListener('DOMContentLoaded', function () {
        displayGenres();
    });

}
