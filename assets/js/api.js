"use strict";

const imageBaseUrl = "https://image.tmdb.org/t/p/";
const base_url = "https://tvflex-movie.netlify.app";
// const base_url = "http://127.0.0.1:3000";

const fetchDataFromServer = async (url, callback, optionalParams) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    callback(data, optionalParams);
  } catch (error) {
    console.error("Error:", error);
  }
};

export { fetchDataFromServer, imageBaseUrl, base_url };
