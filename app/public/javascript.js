// console.log("javascript.js");

//FUNCTIONS

const handleLogin = (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());

  fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.token) {
        localStorage.setItem("token", response.token);
        document.cookie = `token=${response.token}`;
        window.location.href = "/";
      } else {
        const emailError = document.getElementById("email-error");
        const mesText = response.errors.filter(
          (item) => item.param === "email"
        );
        console.log(mesText);
        emailError.innerText = mesText[0]?.msg;
      }
    });
};

const handleLogout = () => {
  if (confirm("Are you sure you want to log out?")) {
    fetch("http://localhost:3001/api/logout", {
      method: "GET",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("User logged out!");
        }
      })
      .then(() => (window.location.href = "/"))
      .catch((error) => console.error(error));
  }
  location.href = "/";
};

const handleOrder = (e) => {
  e.preventDefault();
  const orderForm = document.getElementById("order-form");
  const formData = new FormData(orderForm);
  const data = Object.fromEntries(formData.entries());

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (!data[key]) {
        alert(`${key.toLocaleUpperCase()} is missing`);
        throw new Error(`${key} is missing`);
      }
    }
  }

  fetch("http://localhost:3001/api/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      if (!response.movies) {
        console.log("No response data:", response);
      } else {
        alert(`Movie Sccesfully Booked!`);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleRegister = (e) => {
  e.preventDefault();
  const registerForm = document.getElementById("register-form");
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData.entries());

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (!data[key]) {
        throw new Error(`${key} is missing`);
      }
    }
  }
  data.order_history = "";

  fetch("http://localhost:3001/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        console.log(
          "🚀 ~ file: register.ejs:102 ~ .then ~ response.data:",
          response.data
        );
      }
      console.log("we get here");
      window.location.href = "/";
    })
    .catch((error) => console.log(error));
};

// creates moviecard
const movieCard = (movie) => {
  const movieCard = document.createElement("div");
  movieCard.className = "movie-card";
  movieCard.setAttribute("key", movie.id);

  const movieImage = document.createElement("img");
  movieImage.className = "movie-card__image";
  movieImage.src = movie.imageurl;
  movieImage.alt = `${movie.title} poster`;
  movieCard.appendChild(movieImage);

  const movieInfo = document.createElement("div");
  movieInfo.className = "movie-card__info";

  const movieTitle = document.createElement("h2");
  movieTitle.className = "movie-card__title";
  movieTitle.textContent = movie.title;
  movieInfo.appendChild(movieTitle);

  const imdbRating = document.createElement("p");
  imdbRating.className = "movie-card__imdb";
  imdbRating.textContent = `IMDb Rating: ${movie.imdbrating}`;
  movieInfo.appendChild(imdbRating);

  const movieLink = document.createElement("a");
  movieLink.href = `movies/${movie.id}`;
  movieInfo.appendChild(movieLink);

  const buyButton = document.createElement("button");
  buyButton.className = "buy-movie-button";
  buyButton.id = movie.id;
  buyButton.textContent = "Buy";
  movieInfo.appendChild(buyButton);
  movieCard.appendChild(movieInfo);

  return movieCard;
};

// funtion creating moviecards in movie section for pagination
function createMovieCards(movies, id) {
  const movieSection = document.getElementById("movie-section");
  movieSection.innerHTML = "";

  for (let i = id * 10; i < id * 10 + 10; i++) {
    movieSection.appendChild(movieCard(movies[i]));
  }
}

// modal view creator function
function createModalView() {
  // Create modal element
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.classList.add("modal");

  // Create modal content element
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Create close button element
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("close");
  closeBtn.innerHTML = "&times;";

  // Create modal body element
  const modalBody = document.createElement("div");
  modalBody.id = "modal-body";

  // Append close button to modal content
  modalContent.appendChild(closeBtn);

  // Append modal body to modal content
  modalContent.appendChild(modalBody);

  // Append modal content to modal
  modal.appendChild(modalContent);

  // Add event listeners to close modal
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Add modal to the document body
  document.body.appendChild(modal);
}

//show modal view function
function showModal({ data }) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");

  modalBody.innerHTML = `${data.title}`;
  modal.style.display = "block";

  const closeBtn = document.getElementsByClassName("close")[0];

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}
