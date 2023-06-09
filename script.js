const searchBtn = document.querySelector(".search_btn");
const searchEl = document.querySelector(".search");
const input = document.querySelector(".search_input");
const background = document.querySelector(".search_section");
const songList = document.querySelector(".song_list");
const songSection = document.querySelector(".song");
const loader = document.querySelector(".loader");
const message = document.querySelector(".message");
const searchIcon = document.querySelector(".search_icon");

// Reset input
input.value = "";

// Zatvori input ako kliknemo na background a input je prazan
background.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("search_section") &&
    input.value.length === 0
  ) {
    searchIcon.innerHTML = `<use xlink:href="img/sprite.svg#icon-search"></use>`;
    searchEl.classList.remove("search--active");
    searchBtn.classList.remove("search_btn--remove");
  }
});

// Event listener na escape
window.addEventListener("keydown", function (e) {
  // Zatvori input kad pritisnemo escape a input je prazan

  if (e.key === "Escape" && input.value.trim().length === 0) {
    searchEl.classList.remove("search--active");
    searchBtn.classList.remove("search_btn--remove");
    searchIcon.innerHTML = `<use xlink:href="img/sprite.svg#icon-search"></use>`;
  }
  // Clearaj input i song list
  else if (e.key === "Escape") {
    input.value = "";
    removeItems();
    clearMessage();
    searchBtn.classList.add("search_btn--remove");
  }
  // Ignore
  // Dohvati podatke kad pritisnemo input nije prazan
  // if (e.key === "Enter" && input.value.trim().length !== 0) {
  //   getData();
  // }
});

searchBtn.addEventListener("click", function () {
  if (input.value.trim().length === 0) {
    // Toggle active search ako je input prazan
    searchEl.classList.toggle("search--active");
    // Remove button
    searchBtn.classList.add("search_btn--remove");
    // Fokus na input
    const focusInput = function () {
      input.focus();
    };
    setTimeout(focusInput, 1200);
  } else if (input.value.trim().length !== 0) {
    input.value = "";
    removeItems();
    clearMessage();
    searchBtn.classList.add("search_btn--remove");
  }

  // Ignore
  //else {
  // Dohvati podatke
  // getData();
  // }
});

input.addEventListener("keyup", function () {
  // Ukloni song items
  removeItems();
  // Prikaži loader
  loader.classList.add("loader--active");
  // Clear message
  clearMessage();

  if (input.value.trim().length === 0) {
    // Sakrij loader ako je input prazan
    loader.classList.remove("loader--active");
    clearMessage();
    searchBtn.classList.add("search_btn--remove");
  } else if (input.value.trim().length !== 0) {
    getData();
    searchIcon.innerHTML = `<use xlink:href="img/sprite.svg#icon-close"></use>`;
    searchBtn.classList.remove("search_btn--remove");
  }
});

const getData = async function () {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${input.value}&entity=song`
    );
    const data = await res.json();
    console.log(data);
    // Ako pretraga ne daje rezultate
    if (data.resultCount === 0) {
      loader.classList.remove("loader--active");
      showNoResultsMessage(input.value);
    } else {
      // Clearaj error message
      clearMessage();

      loader.classList.remove("loader--active");
      // Pozvati showItemsOnScreen
      data.results.forEach(function (result) {
        // Prikaži samo 5 elemenata

        showItemsOnScreen(result);
      });

      /* data.results.forEach(function (result, i) {
        // Prikaži samo 5 elemenata
        if (i <= 4) {
          showItemsOnScreen(result);
        } else return;
      }); */
    }
  } catch {
    loader.classList.remove("loader--active");
    removeItems();
    showErrorMessage();
  }
};

/* function getData() {
  // Obriši pjesme
  removeItems();
  // HTTP request
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    `https://itunes.apple.com/search?term=${input.value}&entity=song`,
    true
  );
  request.onload = function (result) {
    const res = JSON.parse(result.currentTarget.response);

    // Ako pretraga ne daje rezultate
    if (res.resultCount === 0) {
      loader.classList.remove("loader--active");
      showNoResultsMessage(input.value);
    } else {
      clearMessage();
      loader.classList.remove("loader--active");
      // Pozvati showItemsOnScreen
      res.results.forEach(function (result, i) {
        // Prikaži samo 5 elemenata
        if (i <= 4) {
          showItemsOnScreen(result);
        } else return;
      });
    }
  };
  // Šaljemo request
  request.send();
} */

// Prikaži elemente
function showItemsOnScreen(data) {
  const item = document.createElement("li");
  item.classList.add("song_item");
  item.innerHTML = `<span class="bold">${data.trackName}</span> - <span >${data.artistName}</span>`;
  songList.appendChild(item);
}

// Obriši song iteme elemente
function removeItems() {
  const songs = document.querySelectorAll(".song_item");
  songs.forEach((song) => {
    songList.removeChild(song);
  });
}

function showNoResultsMessage(input) {
  message.innerHTML = `Nema rezultata za <span class="message_input">"${input}"</span>`;
}

function showErrorMessage() {
  message.innerHTML = "Nešto je pošlo po krivu. Pokušaj ponovno.";
}

function clearMessage() {
  message.innerHTML = "";
}
