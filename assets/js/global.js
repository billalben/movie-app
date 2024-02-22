"use strict";

// add event on multiple elements
const addEventOnElements = (elements, eventType, callback) => {
  if (!elements) return;
  for (const elem of elements) {
    elem.addEventListener(eventType, callback);
  }
};

// Toggle search box in mobile device | small screen
const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

if (searchBox && searchTogglers) {
  addEventOnElements(searchTogglers, "click", () => {
    searchBox.classList.toggle("active");
  });
}
