"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

// Collecting genre name & url parameters from the localStorage
const genreName = window.localStorage.getItem("genreName");
const urlParam = window.localStorage.getItem("urlParam");

const pageContent = document.querySelector("[data-page-content]");

sidebar();

search();

let currentPage = 1;
let totalPages = 0;

fetchDataFromServer(
  `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&${urlParam}&page=${currentPage}`,
  function ({ results: movieList, total_pages }) {
    totalPages = total_pages;

    document.title = `${genreName} Movies | Tvflix`;

    const movieListElement = document.createElement("div");
    movieListElement.classList.add("movie-list", "genre-list");

    movieListElement.ariaLabel = `${genreName} Movies`;

    movieListElement.innerHTML = `
      <div class="title-wrapper">
        <h1 class="heading">All ${genreName} Movies</h1>
      </div>
      <div class="grid-list"></div>
      <button class="btn load-more" data-load-more>Load More</button>
    `;

    // Add movie cards based on the fetched data
    for (const movie of movieList) {
      const movieCard = createMovieCard(movie);
      movieListElement.querySelector(".grid-list").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElement);

    // Load more button functionality
    const loadMoreButton = movieListElement.querySelector("[data-load-more]");
    loadMoreButton.addEventListener("click", function () {
      if (currentPage >= totalPages) {
        this.style.display = "none"; // this refers to the load more button
        return;
      }

      currentPage++;
      this.classList.add("loading");

      fetchDataFromServer(
        `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&${urlParam}&page=${currentPage}`,
        ({ results: movieList }) => {
          this.classList.remove("loading"); // this refers to the load more button

          for (const movie of movieList) {
            const movieCard = createMovieCard(movie);
            movieListElement.querySelector(".grid-list").appendChild(movieCard);
          }
        }
      );
    });
  }
);
