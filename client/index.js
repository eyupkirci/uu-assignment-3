let user = JSON.parse(localStorage.getItem("user"));

console.log("user", user);

const headerMenu = document.getElementById("header-menu");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginButton = document.getElementById("login-button");
const userLi = document.getElementsByClassName("user_li");

const isLoggedUser = (user) => {
  if (user == null || user == "") {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.classList = "user_li anonymous";
    a.setAttribute("href", "./login.html");
    a.textContent = "Login";
    li.appendChild(a);
    headerMenu.appendChild(li);
  } else {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.setAttribute("href", "#");
    a.classList = "user_li registered";
    a.setAttribute("onclick", "return handleLogout()");
    a.textContent = "Logout";
    li.appendChild(a);

    const li2 = document.createElement("li");
    const a2 = document.createElement("a");
    a2.setAttribute("href", "./user.html");
    a2.textContent = `${user.username}`;
    li2.appendChild(a2);

    headerMenu.appendChild(li2);
    headerMenu.appendChild(li);
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
        console.log("User logged out!");
        user = "";
      })
      .then(
        () =>
          (location.href =
            "http://127.0.0.1:5555/uu-assignment-3/client/index.html")
      )
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
          window.location.href =
            "http://127.0.0.1:5555/uu-assignment-3/client/index.html";
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

if (loginButton) {
  loginButton.addEventListener("click", (e) => {
    handleLogin(e);
  });
}

//window load
window.onload = () => {
  isLoggedUser(user);

  //logout
  userLi.addEventListener("click", () => {
    if (user.name) {
      handleLogout();
    }
  });

  // //login

  // loginForm.addEventListener("submit", () => {
  //   // event.preventDefault();

  //   console.log("handleLogin");
  //   const formData = new FormData(loginForm);
  //   const data = Object.fromEntries(formData.entries());
  //   console.log("login: ", data);

  //   fetch("http://localhost:3001/login", {
  //     method: "POST",
  //     // mode: "no-cors",
  //     headers: {
  //       "Content-Type": "application/json;charset=UTF-8",
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data) {
  //         let userString = JSON.stringify(data);
  //         localStorage.setItem("user", userString);
  //         alert(`Logged in.\nWelcome ${data.name}`);
  //       } else {
  //         throw new Error("Network response was not ok");
  //       }
  //     })
  //     .then(() => (window.location.href = "./index.html"))
  //     .catch((error) => console.error(error));
  // });

  //register

  registerForm.addEventListener("submit", (event) => {
    if (registerForm) {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const data = Object.fromEntries(formData.entries());
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
          const userElement = document.querySelector("article");
          userElement.innerHTML = `
      <h2>${data.name}</h2>
      <p>Email: ${data.email}</p>
      <p>Address: ${data.address}</p>
      <p>Credit Card: ${data.credit_card}</p>
      <p>Order History: ${data.order_history}</p>
    `;
        })
        .catch((error) => console.error(error));
    }
  });
};
