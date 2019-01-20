document.addEventListener("DOMContentLoaded", init)

function init(){
  const movieList = document.querySelector(".js-movies")
  const detail = document.querySelector(".js-detail")
  const newButton = document.querySelector(".js-add-movie")

  const emptyState = detail.innerHTML
  newButton.addEventListener("click", function(event){ showNewMovieForm(detail) })
  movieList.addEventListener("click", getSingleMovieDetail)
  getAllMovies().then(iterateMovies)
}


// show //
function iterateMovies(moviesArray){
  moviesArray.forEach(movie => showAllMovies(movie))
}
function showAllMovies(movie){
    const movieList = document.querySelector(".js-movies")
    const movieLi = document.createElement("li")
    movieLi.setAttribute("class", "movie")
    movieLi.setAttribute("data-id", `${movie.id}`)
    movieLi.innerText = movie.title
    movieList.append(movieLi)
}

function getSingleMovieDetail(event){
  let movieID = event.target.dataset.id
  getSingleMovie(movieID).then(data => slapMovieDetail(data))
}

function slapMovieDetail(movie){
  const detail = document.querySelector(".js-detail")
  detail.innerHTML = `<div><h1>Title: ${movie.title}</h1>
      <h4>Year: ${movie.year}</h4>
      <p class="cast-detail">Cast:</p>
      <button data-id=${movie.id} class="danger">Delete</button>
    <div/>`
  const castArea = document.querySelector(".cast-detail")
  const castUl = document.createElement("ul")
  castArea.append(castUl)
  movie.cast.forEach(cast => {
    const castLi = document.createElement("li")
    castLi.innerHTML = cast
    castUl.append(castLi)
    const deleteBtn = document.querySelector(".danger")
    deleteBtn.addEventListener("click", removeMovieFromDom)
  })
}

/// new ///
function showNewMovieForm(detail, movie){
  detail.innerHTML = ""
  detail.innerHTML = `<div><h1>New Movie Form:</h1><br>
  <form class="add-form"method="post">Title:
    <input type="text" class="title" name="title" value="" placeholder ="movie title here" required><br>
      Year: <input type="text" class="year" name="year" value=" " placeholder ="movie year" required><br>
      Cast: <input type="text" class="cast" name="cast" value=" " placeholder ="cast member" required><br>
    <input type="submit">
  </form> </div>`
  const movieForm = document.querySelector(".add-form")
  movieForm.addEventListener("submit", addNewMovie)
}

function addNewMovie(event){
  event.preventDefault();
  const newMovieTitle = event.target.title.value;
  const newMovieYear = event.target.year.value;
  const newMovieCast = [event.target.cast.value];
  const newMovieObj = {"title": newMovieTitle, "year": newMovieYear, "cast": newMovieCast}
  postNewMovie(newMovieObj).then(showAllMovies)
}

function removeMovieFromDom(event){
  let movieID = event.target.dataset.id;
  let deletedMovie = event.target.parentNode
  let movieLi = document.querySelector(`[data-id="${movieID}"]`)
  deletedMovie.remove()
  movieLi.remove()
  deleteMovie(movieID).then(getAllMovies)
}

/// fetch ////
const movieURL = 'http://localhost:3000/movies'

function getAllMovies() {
    return fetch(movieURL)
      .then(response => response.json())
}

function getSingleMovie(movieID) {
    return fetch(movieURL + `/${movieID}`)
      .then(response => response.json())
}

function postNewMovie(newMovieObj) {
  const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",

        },
        body: JSON.stringify(newMovieObj)
    }
    return fetch(movieURL, options)
    .then(response => response.json())
}

function deleteMovie(movieID) {
  const options = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
        },
    }
    return fetch(movieURL + `/${movieID}`, options)
    .then(response => response.json())
}
