let user;

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

window.onload = () => {
  console.log("window fully loaded");

  //login
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    console.log("login: ", data);

    fetch("http://localhost:3001/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        user = data;
        console.log("user:", user);
        const userElement = document.querySelector("section");
        userElement.innerHTML = `
      <h2>Welcome ${data.name}</h2>
      <p>Email: ${data.email}</p>
      <p>Address: ${data.address}</p>
      <p>Order History: ${data.order_history}</p>
    `;
      })
      .catch((error) => console.error(error));

    const cookieValue = document.cookie;
    const decodedValue = decodeURIComponent(cookieValue);
    const jsonObject = JSON.parse(decodedValue);
    console.log(jsonObject);
  });

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

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
});
