"use strict";

import { fetchDataFromServer, api_key } from "./api.js";

export function sidebar() {
  /**
   * Fetch all genres eg: [{ "id": "128", "name": "Action"}]
   * then change the genre formate eg: { 128: "Action" }
   */
  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
    function ({ genres }) {
      genres.forEach(({ id, name }) => {
        genreList[id] = name;
      });

      genreLink();
    }
  );

  const sidebarInner = document.createElement("div");
  sidebarInner.classList.add("sidebar-inner");

  sidebarInner.innerHTML = `
    <div class="sidebar-list">
      <p class="title">Genre</p>
    </div>
    <div class="sidebar-list">
      <p class="title">Language</p>
      <a
        href="./movie-list.html"
        data-menu-close
        class="sidebar-link"
        onclick="getMovieList('with_original_language=en', 'English')"
      >
        English
      </a>
      <a
        href="./movie-list.html"
        data-menu-close
        class="sidebar-link"
        onclick="getMovieList('with_original_language=hi', 'Hindi')"
      >
        Hindi
      </a>
      <a
        href="./movie-list.html"
        data-menu-close
        class="sidebar-link"
        onclick="getMovieList('with_original_language=bn', 'Bengali')"
      >
        Bengali
      </a>
    </div>
    <div class="sidebar-footer">
      <div class="copyright">
        Copyright 2024
        <a href="https://github.com/billalben" target="_blank">billal ben</a>
      </div>
      <img
        src="./assets/images/tmdb-logo.svg"
        width="130"
        height="17"
        alt="the movie database logo"
      />
    </div>
  `;

  function genreLink() {
    Object.entries(genreList).forEach(([genreId, genreName]) => {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "./movie-list.html");
      link.setAttribute("data-menu-close", "");
      link.setAttribute(
        "onclick",
        `getMovieList("with_genres=${genreId}", "${genreName}")`
      );
      link.textContent = genreName;

      sidebarInner.querySelector(".sidebar-list").appendChild(link);
    });

    const sidebar = document.querySelector("[data-sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);
  }

  function toggleSidebar(sidebar) {
    // Toggle sidebar for mobile screen
    const sidebarBtn = document.querySelector("[data-menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[data-menu-toggler]");
    const sidebarClose = document.querySelectorAll("[data-menu-close]");
    const overlay = document.querySelector("[data-overlay]");

    function toggle() {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    }

    addEventOnElements(sidebarTogglers, "click", toggle);
    addEventOnElements(sidebarClose, "click", toggle);
  }
}
