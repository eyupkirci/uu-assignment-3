//FUNCTIONS

// const HOSTNAME =
//   window.location.hostname === "localhost"
//     ? window.location.origin
//     : `${window.location.origin}/group45/`;

const HOSTNAME = "https:/movieticketapp.vercel.app";

console.log("🚀 ~ file: javascript.js:4 ~ HOSTNAME:", HOSTNAME);

const handleLogin = (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());

  fetch(`${HOSTNAME}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.token) {
        document.cookie = `token=${response.token}`;
        window.location.href = HOSTNAME;
      } else {
        const emailError = document.getElementById("email-error");
        const mesText = response.errors.filter(
          (item) => item.param === "email"
        );
        console.log(mesText);
        emailError.innerText = mesText[0]?.msg;

        if (response?.errors[0]?.msg) {
          alert(response?.errors[0]?.msg);
        }
      }
    });
};

const handleLogout = (e) => {
  // e.preventDefault();
  console.log("🚀 ~ file: javascript.js:41 ~ handleLogout ~ handleLogout:");

  const decision = confirm("Are you sure you want to log out?");
  if (decision) {
    document.cookie = `token=""`;
  }
  window.location.href = HOSTNAME;
};

const handleOrder = (e) => {
  e.preventDefault();
  const orderForm = document.getElementById("order-form");

  const formData = new FormData(orderForm);
  const data = Object.fromEntries(formData.entries());
  console.log("🚀 ~ file: javascript.js:59 ~ handleOrder ~ data:", data);

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (!data[key]) {
        alert(`${key.toLocaleUpperCase()} is missing`);
        throw new Error(`${key} is missing`);
      }
    }
  }

  fetch(`${HOSTNAME}/api/buy`, {
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
        window.location.href = HOSTNAME;
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

  fetch(`${HOSTNAME}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response?.token) {
        console.log(
          "🚀 ~ file: register.ejs:102 ~ .then ~ response.data:",
          response
        );
        document.cookie = `token=${response.token}`;
        window.location.href = HOSTNAME;
      } else {
        console.log("🚀 elseeeee:", response);

        const emailError = document.getElementById("email-error");
        const emailErrorText = response.errors.filter(
          (item) => item.param === "email"
        );

        emailError.innerText = emailErrorText[0]?.msg || "";

        const passwordError = document.getElementById("password-error");
        const passwordErrorText = response.errors.filter(
          (item) => item.param === "password"
        );
        passwordError.innerText = passwordErrorText[0]?.msg || "";
      }
    })
    .catch((error) => console.log(error));
};

// function creating moviecard
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

// handle movieavailability check
function handleAvailabilty(e) {
  e.preventDefault();
  console.log("handle availabilty");

  const orderForm = document.getElementById("order-form");
  const movieId = e.target.closest("#movie-detail").getAttribute("key");
  const movieDate = document.getElementById("date").value;

  fetch(`${HOSTNAME}/api/isavailable`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ movieId: movieId, movieDate: movieDate }),
  })
    .then((response) => response.json())
    .then((response) => {
      const movieTimeslots = document.getElementById("movie-timeslots-div");
      const selectBox = document.createElement("select");
      selectBox.id = "movie-timeslots-select";
      selectBox.name = "timeslot";
      for (let index = 0; index < response.length; index++) {
        const movie = response[index];
        const option = document.createElement("option");
        option.value = movie.timeslot;
        option.text = movie.timeslot;
        selectBox.add(option);
      }

      const label = document.createElement("label");
      label.textContent = "Available TimeSlots";
      label.htmlFor = "movie-timeslots-select";

      movieTimeslots.appendChild(label);
      movieTimeslots.appendChild(selectBox);
    })
    .catch((error) => {
      console.log(error);
    });
}

// MODAL VIEW (MOVIEDETAIL AND ORDER SCREEN)
async function movieInModal({ data }) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const user = await fetch(`${HOSTNAME}/api/user`)
    .then((response) => response.json())
    .then(({ user }) => {
      modalBody.innerHTML = `
      <div id="movie-detail" key=${data.id}>
      <div>
      <img src="${data.imageurl}" alt="${data.title}" />
      </div>
      <div>
      <h3>${data.title}</h3>
      <p><strong>Genre:</strong> ${data.genre}</p>
      <p><strong>Released:</strong> ${data.released}</p>
      <p><strong>IMDb ID:</strong> ${data.imdbid}</p>
      <p><strong>IMDb Rating:</strong> ${data.imdbrating}</p>
      <p><strong>Description:</strong> ${data.synopsis}</p>

      ${
        user.username != undefined
          ? `
        <form id="order-form">
          <h3>Book a Ticket</h3>
          <input
            type="hidden"
            name="id"
            value="${data.id}"
            id="movie-id"
          />
          <p>
            <label for="date">Date:</label>
            <input type="date" name="date" id="date" required />
            <button id='check-availability-button'> Availability</button>
          </p>
          <p id="movie-timeslots-div"></p>
          <p>
            <select name="isCompleted">
              <option value="true">Buy</option>
              <option value="false">Book</option>
            </select>
          </p>
          <button type="submit" id="movie-submit-button">Finish</button>
        </form>
      `
          : `
        <div style="text-align: center">
          <label for="login-button">Login / Register to buy ticket</label>
          <a href="./login" id="login-button">
            <button>Login</button>
          </a>
        </div>
      `
      }
        </div>
        </div>
`;

      modal.style.display = "block";
    })
    .catch((err) => console.log(err));

  const closeBtn = document.getElementsByClassName("close")[0];

  //close modal by clicking close btn
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
  //close modal by clicking anywhere on window

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  //handle order
  const orderFinishButton = document.getElementById("movie-submit-button");
  orderFinishButton.addEventListener("click", (e) => {
    handleOrder(e);
  });

  // handle availability

  const availabilityCheckButton = document.getElementById(
    "check-availability-button"
  );
  availabilityCheckButton.addEventListener("click", (e) => {
    handleAvailabilty(e);
  });
}

// buy movie funciton
async function showModalView(e) {
  const movieId = e.target.id;

  const data = await fetch(`${HOSTNAME}/api/movies/${movieId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.log(err));

  createModalView();
  movieInModal(data);
}

//handle panination
function handlePagination(e) {
  let id = e.target.id;
  fetch(`${HOSTNAME}/api/movies`)
    .then((response) => response.json())
    .then(({ data }) => {
      createMovieCards(data, id);
    })
    .then(() => {
      for (let i = 0; i < buyButtons.length; i++) {
        buyButtons[i].addEventListener("click", (e) => {
          showModalView(e);
        });
      }
    })
    .catch((err) => console.log(err));
}

let buyButtons = document.getElementsByClassName("buy-movie-button");
let PageButtons = document.getElementsByClassName("pagination-button");
//add modalview listener
for (let i = 0; i < buyButtons.length; i++) {
  buyButtons[i].addEventListener("click", (e) => {
    showModalView(e);
  });
}
//add modalview listener after pagination
for (let i = 0; i < PageButtons.length; i++) {
  PageButtons[i].addEventListener("click", (e) => {
    handlePagination(e);
  });
}

document.getElementById("logout-button").addEventListener("click", (e) => {
  handleLogout(e);
});
