const btn = document.querySelector(".search_btn");
const searchEl = document.querySelector(".search");
const input = document.querySelector(".search_input");
const background = document.querySelector(".search_section");
const songList = document.querySelector(".song_list");
const songSection = document.querySelector(".song");
const loader = document.querySelector(".loader");
const message = document.querySelector(".message");
const searchIcon = document.querySelector(".search_icon");

input.value = "";
let searchTimeout;

// Zatvori input ako kliknemo na background
background.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("search_section") &&
    input.value.length === 0
  ) {
    searchIcon.innerHTML = `<use xlink:href="img/sprite.svg#icon-search"></use>`;
    searchEl.classList.remove("search--active");
    btn.classList.remove("search_btn--remove");
    input.blur();
  }
});

window.addEventListener("keydown", function (e) {
  // Zatvori input kad pritisnemo escape a input je prazan

  if (e.key === "Escape" && input.value.trim().length === 0) {
    searchEl.classList.remove("search--active");
    btn.classList.remove("search_btn--remove");
    searchIcon.innerHTML = `<use xlink:href="img/sprite.svg#icon-search"></use>`;
    input.blur();
  }
  // Clearaj input i song list
  else if (e.key === "Escape") {
    input.value = "";
    songList.innerHTML = "";
    clearMessage();
    btn.classList.add("search_btn--remove");
  }
});

btn.addEventListener("click", function () {
  if (input.value.trim().length === 0) {
    // Toggle active search ako je input prazan
    searchEl.classList.toggle("search--active");
    btn.classList.add("search_btn--remove");
    // Fokus na input
    const focusInput = function () {
      input.focus();
    };
    setTimeout(focusInput, 1200);
  } else if (input.value.trim().length !== 0) {
    input.value = "";
    songList.innerHTML = "";
    clearMessage();
    btn.classList.add("search_btn--remove");
  }
});

input.addEventListener("input", function () {
  loader.classList.add("loader--active");
  clearMessage();
  clearTimeout(searchTimeout);
  findSongs();
  if (input.value.trim().length === 0) {
    // Sakrij loader ako je input prazan
    loader.classList.remove("loader--active");
    songList.innerHTML = "";
    btn.classList.add("search_btn--remove");
  } else if (input.value.trim().length !== 0) {
    searchIcon.innerHTML = `<use xlink:href="img/sprite.svg#icon-close"></use>`;
    btn.classList.remove("search_btn--remove");
  }
});

async function loadSongs(searchTerm) {
  try {
    const URL = `https://itunes.apple.com/search?term=${searchTerm}&entity=song`;
    const res = await fetch(URL);
    const data = await res.json();

    if (data.resultCount === 0) {
      loader.classList.remove("loader--active");
      songList.innerHTML = "";
      showNoResultsMessage(input.value);
    } else {
      displaySongList(data.results);
    }
  } catch {
    loader.classList.remove("loader--active");
    songList.innerHTML = "";
    showErrorMessage();
  }
}

function findSongs() {
  let searchTerm = input.value.trim();
  if (searchTerm.length > 0) {
    songList.classList.remove("song_list--hide");
    searchTimeout = setTimeout(() => {
      loadSongs(searchTerm);
    }, 500);
  } else songList.classList.add("song_list--hide");
}

function displaySongList(songs) {
  loader.classList.remove("loader--active");
  songList.innerHTML = "";
  message.innerHTML = "";
  songs.forEach((song, i) => {
    if (i < 5) {
      let songListItem = document.createElement("li");
      songListItem.classList.add("song_item");
      songListItem.innerHTML = `<span class="bold">${song.trackName}</span> - <span >${song.artistName}</span>`;
      songList.appendChild(songListItem);
    } else return;
  });
}

function showNoResultsMessage(input) {
  message.innerHTML = `Nema rezultata za pojam <span class="message_input">"${input}"</span>`;
}

function showErrorMessage() {
  message.innerHTML = "Greška. Pokušaj ponovno.";
}

function clearMessage() {
  message.innerHTML = "";
}
