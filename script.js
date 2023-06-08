const searchBtn = document.querySelector(".search_btn");
const searchEl = document.querySelector(".search");
const input = document.querySelector(".search_input");
const background = document.querySelector(".search_section");
const songList = document.querySelector(".song_list");
const songSection = document.querySelector(".song");
const loader = document.querySelector(".loader");
const message = document.querySelector(".message");

// Reset input
input.value = "";

// Zatvori input ako kliknemo na background a input je prazan
background.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("search_section") &&
    input.value.length === 0
  ) {
    searchEl.classList.remove("search--active");
  }
});

// Event listener na escape
window.addEventListener("keydown", function (e) {
  // Zatvori input kad pritisnemo escape a input je prazan
  if (e.key === "Escape" && input.value.trim().length === 0) {
    searchEl.classList.remove("search--active");
  }
  // Clearaj input i song list
  if (e.key === "Escape") {
    input.value = "";
    removeItems();
  }
  // Ignore
  // Dohvati podatke kad pritisnemo input nije prazan
  // if (e.key === "Enter" && input.value.trim().length !== 0) {
  //   getData();
  // }
});

searchBtn.addEventListener("click", function () {
  if (input.value.trim().length === 0) {
    // Toggle active ako je input prazan
    searchEl.classList.toggle("search--active");

    // Fokus na input
    const focusInput = function () {
      input.focus();
    };
    setTimeout(focusInput, 1200);
  }

  // Ignore
  //else {
  // Dohvati podatke
  // getData();
  // }
});

input.addEventListener("input", function () {
  // Prikaži loader
  loader.classList.add("loader--active");
  // Clear message
  message.innerHTML = "";
  // Ukloni song items
  removeItems();
  if (input.value.trim().length === 0) {
    // Sakrij loader ako je input prazan
    loader.classList.remove("loader--active");
    message.innerHTML = "";
  } else if (input.value.trim().length !== 0) {
    getData();
  }
});

const getData = async function () {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${input.value}&entity=song`
    );
    const data = await res.json();

    // Ako pretraga ne daje rezultate
    if (data.resultCount === 0) {
      loader.classList.remove("loader--active");
      showNoResultsMessage(input.value);
    } else {
      clearMessage();
      loader.classList.remove("loader--active");
      // Pozvati showItemsOnScreen
      data.results.forEach(function (result, i) {
        // Prikaži samo 5 elemenata
        if (i <= 4) {
          showItemsOnScreen(result);
        } else return;
      });
    }
  } catch {
    loader.classList.remove("loader--active");
    removeItems();
    showErrorMessage();
  }
};

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
