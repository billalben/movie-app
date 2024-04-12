"use strict";

/**
 * Adds an event listener to multiple elements.
 *
 * @param {NodeList} elements - The elements to add the event listener to.
 * @param {string} eventType - The type of event to listen for (e.g., 'click', 'keydown').
 * @param {Function} callback - The function to be executed when the event is triggered.
 */
const addEventOnElements = (elements, eventType, callback) => {
  if (!elements) return;
  for (const elem of elements) {
    elem.addEventListener(eventType, callback);
  }
};

// Toggle search box in mobile device | small screen
const searchBox = document.querySelector("[data-search-box]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

if (searchBox && searchTogglers) {
  addEventOnElements(searchTogglers, "click", () => {
    searchBox.classList.toggle("active");
  });
}

// Store movie id in local storage when a movie card is clicked
const getMovieDetail = function (movieId) {
  window.localStorage.setItem("movieId", String(movieId));
}
