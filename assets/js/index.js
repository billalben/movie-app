"use strict";

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseUrl, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

const pageContent = document.querySelector("[data-page-content]");

sidebar();

// Home page sections (top rated, upcoming, trending movies)
const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming",
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "Top rated Movies",
    path: "/movie/top_rated",
  },
];

/**
 * Fetch all genres eg: [{ "id": "128", "name": "Action"}]
 * then change the genre formate eg: { 128: "Action" }
 */
const genreList = {
  // create genre string from genre_id eg: [23, 43] → "Action, Romance".
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]); // this === genreList
    }

    return newGenreList.join(", ");
  },
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
  function ({ genres }) {
    genres.forEach(({ id, name }) => {
      genreList[id] = name;
    });

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
      heroBanner
    );
  }
);

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("div");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider"></div>

    <div class="slider-control">
      <div class="control-inner"></div>
    </div>
  `;

  let controlItemIndex = 0;

  Object.entries(movieList).forEach(([index, movie]) => {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("data-slider-item", "");

    sliderItem.innerHTML = `
      <img
        src="${imageBaseUrl}w1280${backdrop_path}"
        alt="${title}"
        class="img-cover"
        loading="${index === 0 ? "eager" : "lazy"}"
      />
      <div class="banner-content">
        <h2 class="heading">${title}</h2>
        <div class="meta-list">
          <div class="meta-item">${release_date.split("-")[0]}</div>
          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
        <p class="genre">${genreList.asString(genre_ids)}</p>
        <p class="banner-text">${overview}</p>
        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
          <img
            src="./assets/images/play_circle.png"
            width="24"
            height="24"
            aria-hidden="true"
            alt="play circle"
          />
          <span class="span">Watch Now</span>
        </a>
      </div>
    `;

    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("data-slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
      <img
        src="${imageBaseUrl}w154${poster_path}"
        alt="Slide to ${title}"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    `;

    banner.querySelector(".control-inner").appendChild(controlItem);
  });

  pageContent.appendChild(banner);

  addHeroSlider();

  // fetch data for home page sections (top rated, upcoming, trending movies)
  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
      createMovieList,
      title
    );
  }
};

/**
 * Hero Slider Functionality
 */

const addHeroSlider = function () {
  const sliderItems = document.querySelectorAll("[data-slider-item]");
  const sliderControls = document.querySelectorAll("[data-slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    // this == data-slider-controls
    // sliderItems[Number(this.getAttribute("data-slider-control"))].classList.add("active");
    sliderItems[Number(this.dataset.sliderControl)].classList.add("active");
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.dataset.sliderControl)];
    lastSliderControl = this;
  };

  addEventOnElements(sliderControls, "click", sliderStart);
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListElement = document.createElement("section");
  movieListElement.classList.add("movie-list");
  movieListElement.ariaLabel = `${title}`;

  movieListElement.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
    </div>
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); // Called from movie-card.js

    movieListElement.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElement);
};
