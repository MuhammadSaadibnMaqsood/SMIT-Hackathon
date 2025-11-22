// ===============================
// LOGIN FUNCTIONALITY
// ===============================

// Selecting elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.querySelector("button");

loginBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Basic validation
  if (!email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Missing Information",
      text: "Please enter both email and password",
      confirmButtonColor: "#53f",
    });
    return;
  }

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email & password match
  const matchedUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!matchedUser) {
    Swal.fire({
      icon: "error",
      title: "Invalid Credentials",
      text: "Email or password is incorrect",
      confirmButtonColor: "#53f",
    });
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));

  Swal.fire({
    icon: "success",
    title: "Login Successful!",
    text: "Welcome back!",
    confirmButtonColor: "#53f",
  }).then(() => {
    window.location.href = "../index.html";
  });
});
