// ===============================
// SIGNUP FUNCTIONALITY
// ===============================

// Selecting elements
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.querySelector("button");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex:
// 1 uppercase, 1 lowercase, 1 number, 1 special character, 6+ chars
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

signupBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // ===============================
  // Empty field validation
  // ===============================
  if (!username || !email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill out all fields",
      confirmButtonColor: "#53f",
    });
    return;
  }

  // ===============================
  // Email format validation
  // ===============================
  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address like example@gmail.com",
      confirmButtonColor: "#53f",
    });
    return;
  }

  // ===============================
  // Password strength validation
  // ===============================
  if (!passwordRegex.test(password)) {
    Swal.fire({
      icon: "error",
      title: "Weak Password",
      html:
        "Password must include:<br>" +
        "• At least <b>6 characters</b><br>" +
        "• At least <b>1 uppercase letter</b><br>" +
        "• At least <b>1 lowercase letter</b><br>" +
        "• At least <b>1 number</b><br>" +
        "• At least <b>1 special character</b> (@ $ ! % * ? &)",
      confirmButtonColor: "#53f",
    });
    return;
  }

  // ===============================
  // Check if user exists
  // ===============================
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = users.some((u) => u.email === email);

  if (emailExists) {
    Swal.fire({
      icon: "error",
      title: "Email Already Registered",
      text: "Please use a different email",
      confirmButtonColor: "#53f",
    });
    return;
  }

  // ===============================
  // Create user object
  // ===============================
  const newUser = {
    username,
    email,
    password,

    // Pre-create these for profile screen
    profilePic: "",
    bio: "",

    createdAt: new Date().toISOString(),
  };

  // Save new user in localStorage
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  // Success alert
  Swal.fire({
    icon: "success",
    title: "Signup Successful",
    text: "Your account has been created",
    confirmButtonColor: "#53f",
  }).then(() => {
    window.location.href = "./login.html";
  });
});
