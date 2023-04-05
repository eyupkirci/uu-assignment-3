// console.log("javascript.js");

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
      console.log(response);
      console.log("🚀 ~ file: login.ejs:71 ~ .then ~ response:", response);
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

  fetch("http://localhost:3001/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      if (!response.ok) {
        console.log(
          "🚀 ~ file: register.ejs:102 ~ .then ~ response.data:",
          response.data
        );
      }

      // if (data) {
      //   let userString = JSON.stringify(data.user);
      //   localStorage.setItem("user", userString);
      //   window.location.href = "./index.html";
      //   alert(`${data.message} \nWelcome ${data.user.name}`);
      //   formData = "";
      // } else {
      //   throw new Error("Network response was not ok");
      // }
    })
    .catch((error) => console.log(error));
};
