let user;

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// registerForm.addEventListener("submit", (event) => {
//   event.preventDefault();

//   console.log("register-form");
//   const formData = new FormData(registerForm);
//   const data = Object.fromEntries(formData.entries());
//   data.order_history = "";
//   console.log(data);

//   const xhr = new XMLHttpRequest();
//   const url = "http://localhost:3001/register";
//   const params = `email=${encodeURIComponent(
//     data.email
//   )}&password=${encodeURIComponent(data.password)}&name=${encodeURIComponent(
//     data.name
//   )}&address=${encodeURIComponent(
//     data.address
//   )}&credit_card=${encodeURIComponent(
//     data.credit_card
//   )}&order_history=${encodeURIComponent(data.order_history)}`;

//   console.log(params);

//   xhr.open("POST", url, true);
//   xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

//   xhr.onreadystatechange = () => {
//     if (xhr.readyState === 4) {
//       if (xhr.status === 200) {
//         alert("Login successful!");
//       } else {
//         alert("Invalid email or password.");
//       }
//     }
//   };

//   xhr.send(params);
// });

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
    // .then((response) => {
    //   if (response.ok) {
    //     alert("Login successful!");
    //   } else {
    //     alert("Invalid email or password.");
    //   }
    // })
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

  // const xhr = new XMLHttpRequest();
  // const url = "http://localhost:3001/login";
  // const params = `email=${encodeURIComponent(
  //   data.email
  // )}&password=${encodeURIComponent(data.password)}`;

  // xhr.open("POST", url, true);
  // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  // xhr.onreadystatechange = () => {
  //   if (xhr.readyState === 4) {
  //     if (xhr.status === 200) {
  //       alert("Login successful!");
  //     } else {
  //       alert("Invalid email or password.");
  //     }
  //   }
  // };

  // xhr.send(params);

  const cookieValue = document.cookie;
  const decodedValue = decodeURIComponent(cookieValue);
  const jsonObject = JSON.parse(decodedValue);
  console.log(jsonObject);
});

window.onload = () => {
  console.log("window fully loaded");

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

      // const xhr = new XMLHttpRequest();
      // const url = "http://localhost:3001/users/register";
      // const params = `email=${encodeURIComponent(
      //   data.email
      // )}&password=${encodeURIComponent(
      //   data.password
      // )}&name=${encodeURIComponent(data.name)}&address=${encodeURIComponent(
      //   data.address
      // )}&credit_card=${encodeURIComponent(
      //   data.credit_card
      // )}&order_history=${encodeURIComponent(data.order_history)}`;

      // xhr.open("POST", url, true);
      // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

      // xhr.onreadystatechange = () => {
      //   if (xhr.readyState === 4) {
      //     if (xhr.status === 200) {
      //       alert("Login successful!");
      //     } else {
      //       alert("Invalid email or password.");
      //     }
      //   }
      // };

      // xhr.send(params);
    }
  });

  // loginForm.addEventListener("submit", (event) => {
  //   event.preventDefault();
  //   console.log("login-form");

  //   const formData = new FormData(loginForm);
  //   const data = Object.fromEntries(formData.entries());
  //   console.log("login: ", data);

  //   const xhr = new XMLHttpRequest();
  //   const url = "http://localhost:3001/login";
  //   const params = `email=${encodeURIComponent(
  //     data.email
  //   )}&password=${encodeURIComponent(data.password)}`;

  //   xhr.open("POST", url, true);
  //   xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {
  //         alert("Login successful!");
  //       } else {
  //         alert("Invalid email or password.");
  //       }
  //     }
  //   };

  //   xhr.send(params);
  // });
};

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
});
