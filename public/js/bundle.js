(() => {
  // public/js/login.js
  var login = async (email, password) => {
    try {
      const res = await axios({
        method: "POST",
        url: "/api/v1/users/login",
        data: {
          email,
          password
        }
      });
      if (res.data.status === "success") {
        alert("JA BLJAD");
        window.setTimeout(() => {
          location.assign("/");
        }, 1500);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // public/js/index.js
  document.querySelector(".form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
})();
