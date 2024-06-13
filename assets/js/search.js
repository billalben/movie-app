"use search";

import { base_url, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchWrapper = document.querySelector("[data-search-wrapper]");
  const searchField = searchWrapper.querySelector("[data-search-field]");

  const searchResultModal = document.createElement("div");
  searchResultModal.classList.add("search-modal");

  document.querySelector("main").appendChild(searchResultModal);

  let searchTimeout = null;

  searchField.addEventListener("input", function () {
    if (!searchField.value.trim()) {
      searchResultModal.classList.remove("active");
      searchWrapper.classList.remove("searching");
      clearTimeout(searchTimeout);
      return;
    }

    searchWrapper.classList.add("searching");
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(function () {
      // `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`
      
      fetchDataFromServer(
        `${base_url}/m/search?query=${searchField.value}&page=1&include_adult=false`,
        function ({ results: movieList }) {
          searchWrapper.classList.remove("searching");
          searchResultModal.classList.add("active");
          searchResultModal.innerHTML = ""; // Remove the old search results

          searchResultModal.innerHTML = `
            <p class="label">Results for</p>
            <h1 class="heading">${searchField.value}</h1>
            <div class="movie-list">
              <div class="grid-list"></div>
            </div>
          `;

          for (const movie of movieList) {
            const movieCard = createMovieCard(movie);
            searchResultModal
              .querySelector(".grid-list")
              .appendChild(movieCard);
          }
        }
      );
    }, 600);
  });
}
