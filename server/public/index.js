// global variables
let user = JSON.parse(localStorage.getItem("user")) || null;
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let movies = [];

// selectors
const headerMenu = document.getElementById("header-menu");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginButton = document.getElementById("login-button");
const RegisterButton = document.getElementById("register-button");
const userLi = document.getElementById("user_li");
const movieSection = document.getElementById("movie-section");

// functions
const createMovieCard = (movie) => {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");
  movieCard.setAttribute("key", movie.id);

  const image = document.createElement("img");
  image.classList.add("movie-card__image");
  image.src = movie.imageurl;
  image.alt = `${movie.title} poster`;
  movieCard.appendChild(image);

  const info = document.createElement("div");
  info.classList.add("movie-card__info");
  movieCard.appendChild(info);

  const title = document.createElement("h2");
  title.classList.add("movie-card__title");
  title.textContent = movie.title;
  info.appendChild(title);

  const imdbRating = document.createElement("p");
  imdbRating.classList.add("movie-card__imdb");
  imdbRating.textContent = `IMDb Rating: ${movie.imdbrating}`;
  info.appendChild(imdbRating);
  if (user) {
    const buyButton = document.createElement("button");
    buyButton.textContent = "Add to cart";
    buyButton.classList.add("movie-card__add-orders");
    buyButton.addEventListener("click", () => {
      addOrder(movie);
      // let orderString = JSON.stringify(movie);
      // localStorage.setItem("orders", orderString);
      // fetch(`/movies/${movieId}`)
      //   .then((response) => response.json())
      //   .then((movie) => {
      //     const orders = JSON.parse(localStorage.getItem("orders")) || [];
      //     orders.push(movie);
      //     localStorage.setItem("orders", JSON.stringify(orders));
      //   });
    });
    info.appendChild(buyButton);
  }

  return movieCard;
};

const displayMovieCards = (movies) => {
  if (movies.length) {
    movies.map((movie) => {
      const movieCard = createMovieCard(movie);
      movieSection.appendChild(movieCard);
    });
  } else {
    displayMovieCards(movies);
  }
};

// const fetchMovies = () => {
//   fetch("http://localhost:3001/movies")
//     .then((response) => response.json())
//     .then((moviesData) => {
//       if (moviesData) {
//         movies = moviesData;
//         console.log("movies", movies);
//         let moviesString = JSON.stringify(moviesData);
//         localStorage.setItem("movies", moviesString);
//       } else {
//         throw new Error("Network response was not ok");
//       }
//     })
//     .catch((error) => console.error(error));
// };
// fetchMovies();

// functions

// async function getMovies() {
//   try {
//     const response = await fetch("http://localhost:3001/movies");
//     const moviesData = await response.json();

//     if (moviesData) {
//       movies = moviesData;
//       console.log("movies", movies);
//       let moviesString = JSON.stringify(moviesData);
//       localStorage.setItem("movies", moviesString);

//       displayMovies(moviesData);
//     } else {
//       console.log("Network response was not ok");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

const handleLoggedUser = (user) => {
  //home link
  const homeLi = document.createElement("li");
  headerMenu.appendChild(homeLi);
  const homeA = document.createElement("a");
  homeA.setAttribute("href", "./index.html");
  homeA.textContent = "Home";
  homeLi.appendChild(homeA);

  if (user == null || user == "") {
    //login link
    const anonymousUserli = document.createElement("li");
    headerMenu.appendChild(anonymousUserli);
    const userA = document.createElement("a");
    userA.setAttribute("id", "user_li");
    userA.setAttribute("href", "./login.html");
    userA.textContent = "Login";
    anonymousUserli.appendChild(userA);
  } else {
    //user link
    const registeredUserli = document.createElement("li");
    headerMenu.appendChild(registeredUserli);
    const registeredUserA = document.createElement("a");
    registeredUserA.setAttribute("href", "./user.html");
    registeredUserA.textContent = `${user.username}`;
    registeredUserli.appendChild(registeredUserA);
    //logout link
    const LogoutLi = document.createElement("li");
    headerMenu.appendChild(LogoutLi);
    const LogoutA = document.createElement("a");
    LogoutA.setAttribute("href", "#");
    LogoutA.setAttribute("id", "user_li");
    LogoutA.setAttribute("onclick", "return handleLogout()");
    LogoutA.textContent = "Logout";
    LogoutA.addEventListener("click", () => {
      if (user.name) {
        handleLogout();
      }
    });
    LogoutLi.appendChild(LogoutA);
  }
};

const handleLogout = () => {
  if (confirm("Are you sure you want to log out?")) {
    fetch("http://localhost:3001/logout", {
      method: "GET",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        // response.json();
        document.cookie =
          "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("user");
        localStorage.removeItem("orders");
        console.log("User logged out!");
        user = "";
        orders = [];
      })
      .then(() => (location.href = "./index.html"))
      .catch((error) => console.error(error));
  }
};

const handleLogin = () => {
  if (user == null) {
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    console.log("login: ", data);

    fetch("http://localhost:3001/login", {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          let userString = JSON.stringify(data);
          localStorage.setItem("user", userString);
          window.location.href = "./index.html";
          alert(`Logged in.\nWelcome ${data.name}`);
          formData = "";
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => console.error(error));

    const cookieValue = document.cookie;
    const decodedValue = decodeURIComponent(cookieValue);
    const jsonObject = JSON.parse(decodedValue);
    console.log(jsonObject);
  } else {
    alert("User already logged in");
  }
};

const handleRegister = () => {
  if (user == null) {
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
    fetch("http://localhost:3001/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          let userString = JSON.stringify(data.user);
          localStorage.setItem("user", userString);
          window.location.href = "./index.html";
          alert(`${data.message} \nWelcome ${data.user.name}`);
          formData = "";
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .catch((error) => console.error(error));
  } else {
    alert("User already registered");
  }
};

const addOrder = (movie) => {
  orders.push(movie);
  let updatedOrders = JSON.stringify(orders);
  localStorage.setItem("orders", updatedOrders);
};

// fetch movie and insert movies
fetch("http://localhost:3001/movies")
  .then((response) => response.json())
  .then((moviesData) => {
    if (moviesData) {
      movies = moviesData;
      console.log("movies", movies);
      let moviesString = JSON.stringify(moviesData);
      localStorage.setItem("movies", moviesString);
      if (movieSection) {
        displayMovieCards(movies);
      }
    } else {
      console.log("Network response was not ok");
    }
  })
  .catch((error) => console.error(error));

//event listeners

if (loginButton) {
  loginButton.addEventListener("click", (e) => {
    handleLogin(e);
  });
}

if (RegisterButton) {
  RegisterButton.addEventListener("click", (e) => {
    handleRegister(e);
  });
}

//window load
window.onload = () => {
  handleLoggedUser(user);
};
