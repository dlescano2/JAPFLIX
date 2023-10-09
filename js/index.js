const apiUrl = "https://japceibal.github.io/japflix_api/movies-data.json";
const search = document.getElementById("inputBuscar")
const btnsearch = document.getElementById("btnBuscar")
const containerList = document.getElementById('lista')
let datos;


fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("No se pudo obtener la respuesta de la API");
    }
    return response.json();
  })
  .then((data) => {
    datos = data;
    console.log(datos);
  })
  .catch((error) => {
    console.error("Hubo un error al obtener datos de la API:", error);
  });

  function moviesByTitle(titulo) {
    return datos.filter((pelicula) =>
      pelicula.title.toLowerCase().includes(titulo.toLowerCase())
    );
  }
  function filtrartag(tagline) {
    const palabraBuscada = tagline.toLowerCase().trim();
  
    return datos.filter((pelicula) => {
      return pelicula.tagline
        .toLowerCase()
        .split(" ")
        .some((palabra) => palabra === palabraBuscada);
    });
  }
  function moviesByGenre(genero){
  return datos.filter(pelicula =>
      pelicula.genres.some(genres => genres.name.toLowerCase().includes(genero.toLowerCase()))
      );
  }
  search.addEventListener("input", function () {
    const searchedTitle = search.value;
    const moviesByTitleResult = moviesByTitle(searchedTitle);
    const moviesByGenreResult = moviesByGenre(searchedTitle);
    const tagFiltrados = filtrartag(searchedTitle);
  
    const combinedResults = [
      ...moviesByTitleResult,
      ...moviesByGenreResult,
      ...tagFiltrados,
    ];
  
    showResults(combinedResults);
  });
  
  btnsearch.addEventListener("click", function () {
    const searchedTitle = search.value;
    const moviesByTitleResult = moviesByTitle(searchedTitle);
    const moviesByGenreResult = moviesByGenre(searchedTitle);
    const tagFiltrados = filtrartag(searchedTitle);

    const combinedResults = [...moviesByTitleResult, ...moviesByGenreResult, ...tagFiltrados];
    
    showResults(combinedResults)
  });



function showResults(movies) {
containerList.innerHTML="";

movies.forEach(movie =>{
   const offcanvasId = `offcanvasTop-${movie.id}`;
    const genresList = movie.genres.map(genre => genre.name).join(', ');

containerList.innerHTML += `
  <div class="result" data-bs-toggle="offcanvas" data-bs-target="#${offcanvasId}" aria-controls="${offcanvasId}">
      <li><p class="title">${movie.title}</p></li>
      <li><p class="tag">${movie.tagline}</p></li>
      <div class="score" id="${movie.id}">
            <div class="stars"></div>
          </div>
      <hr class="division">
      
  </div>

  <div class="offcanvas offcanvas-top containercanvas" tabindex="-1" id="${offcanvasId}" aria-labelledby="${offcanvasId}Label">
      <div class="offcanvas-header">
            <h2 class="offcanvas-title" id="${offcanvasId}Label">${movie.title}</h2>
            <div class="dropdown more">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    More
                </button>
                <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Year:${
                  movie.release_date.split("-")[0]
                }</a></li>
                <li><a class="dropdown-item" href="#">Runtime:${
                  movie.runtime
                } mins</a></li>
                <li><a class="dropdown-item" href="#">Budget: $${
                  movie.budget
                }</a></li>
                <li><a class="dropdown-item" href="#">Revenue: $${
                  movie.revenue
                }</a></li>
            </ul>
            </div>
      </div>
      <div class="offcanvas-body">
      <p>${movie.overview}</p><hr>
      <p class="genresList">${genresList}</p>
      </div>
  </div>
`;
    const starContainer = document.getElementById(`${movie.id}`);
    const starsDiv = starContainer.querySelector(".stars");
    
    let voteAverage = movie.vote_average / 2;
    for (let i = 0; i < 5; i++) {
      const star = document.createElement("span");
      star.classList.add("fa", "fa-star");
      
      if (i < Math.round(voteAverage)) {
        star.classList.add('checked');
      } else {
        star.classList.add('text-light');
      }

      starsDiv.appendChild(star);
    }
  });
}
