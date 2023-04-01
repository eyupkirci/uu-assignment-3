const loginForm = document.getElementById("login-form");

const handleLogin = () => {
  const formData = new FormData(loginForm);

  fetch("http://localhost:3001/login", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      console.log(data);
      // redirect to home page
      window.location.href = "/home";
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      // handle error here
    });
};

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("loginform triggered");
    // handleLogin();
  });
}
