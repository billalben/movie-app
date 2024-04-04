"use strict";

const api_key = "3745aac7a5fee377988592f74a46b3fb";
const imageBaseUrl = "https://image.tmdb.org/t/p/";

const fetchDataFromServer = function (url, callback, optionalParams) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data, optionalParams))
    .catch((error) => console.error("Error:", error));
};

export { fetchDataFromServer, api_key, imageBaseUrl };
