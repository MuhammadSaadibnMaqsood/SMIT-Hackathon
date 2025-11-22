const loginUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loginUser) {
  window.location.href = "./authfolder/login.html";
}

const profileimg = document.getElementById("userImg");
const profilePicLarge = document.getElementById("profilePicLarge");
const defaultPic =
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

profileimg.src = loginUser?.profilePic || defaultPic;
profilePicLarge.src = loginUser?.profilePic || defaultPic;
document.getElementById("profileUsername").textContent =
  loginUser?.username || "User";

let currentEditPostId = null;


function handleProfileImg() {
  document.getElementById("drop-down").classList.toggle("show");
}

document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("drop-down");
  const logoutBtn = document.querySelector(".logout-btn");
  if (!logoutBtn.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("loggedInUser");
  window.location.href = "./authfolder/login.html";
});

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
}

const sunIconLink =
  "https://play-lh.googleusercontent.com/T7iJ8gb1bHJzDsOJeRzMqg7ZKcRuVOr6XE5-Uzj0inIcKq4v6l4kKyQTArgxXyha9Ag"; // Aapka diya hua current link

const moonIconLink =
  "https://png.pngtree.com/png-vector/20220726/ourmid/pngtree-light-mode-dark-mode-glyph-ui-icon-silhouette-mode-light-vector-png-image_47717214.jpg";

function updateIcon() {
  const iconImg = document.getElementById("darkModeIcon");

  const isDarkModeOn = document.body.classList.contains("dark-mode");

  if (isDarkModeOn) {
    iconImg.src = moonIconLink;
  } else {
    iconImg.src = sunIconLink;
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );

  updateIcon();
}

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

updateIcon();
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

function goToHome() {
  window.location.href = "./index.html";
}

function openPostModal() {
  currentEditPostId = null;
  document.getElementById("modalTitle").textContent = "Create New Post";
  document.getElementById("submitBtn").textContent = "Post";
  document.getElementById("postModal").classList.add("show");
  document.getElementById("postForm").reset();
  document.getElementById("imagePreview").style.display = "none";
  document.getElementById("uploadText").style.display = "block";
  document.getElementById("imageUploadArea").classList.remove("has-image");
}

function closePostModal() {
  document.getElementById("postModal").classList.remove("show");
  currentEditPostId = null;
}

function openBioModal() {
  const currentBio = localStorage.getItem(`bio_${loginUser.username}`) || "";
  document.getElementById("bioInput").value = currentBio;
  document.getElementById("bioModal").classList.add("show");
}

function closeBioModal() {
  document.getElementById("bioModal").classList.remove("show");
}

document
  .getElementById("postImageInput")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("imagePreview").src = e.target.result;
        document.getElementById("imagePreview").style.display = "block";
        document.getElementById("uploadText").style.display = "none";
        document.getElementById("imageUploadArea").classList.add("has-image");
      };
      reader.readAsDataURL(file);
    }
  });

function getAllPosts() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}

function getUserPosts() {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.userId === loginUser.username);
}

function isPostLikedByUser(postId) {
  const likedPosts =
    JSON.parse(localStorage.getItem(`liked_${loginUser.username}`)) || [];
  return likedPosts.includes(postId);
}

// ⭐ KEY LOGIC FOR LIKES ⭐
function toggleLike(postId) {
  const allPosts = getAllPosts();
  const postIndex = allPosts.findIndex((p) => p.id === postId);

  if (postIndex !== -1) {
    const likedPosts =
      JSON.parse(localStorage.getItem(`liked_${loginUser.username}`)) || [];
    const isLiked = likedPosts.includes(postId);

    if (isLiked) {
      allPosts[postIndex].likes = Math.max(
        0,
        (allPosts[postIndex].likes || 0) - 1
      );
      const index = likedPosts.indexOf(postId);
      likedPosts.splice(index, 1);
    } else {
      allPosts[postIndex].likes = (allPosts[postIndex].likes || 0) + 1;
      likedPosts.push(postId);
    }

    localStorage.setItem("posts", JSON.stringify(allPosts));
    localStorage.setItem(
      `liked_${loginUser.username}`,
      JSON.stringify(likedPosts)
    );
    displayPosts();
  }
}

function editPost(postId) {
  currentEditPostId = postId;
  const allPosts = getAllPosts();
  const post = allPosts.find((p) => p.id === postId);

  if (!post) return;

  document.getElementById("modalTitle").textContent = "Edit Post";
  document.getElementById("submitBtn").textContent = "Update Post";
  document.getElementById("postCaption").value = post.content;

  if (post.image) {
    document.getElementById("imagePreview").src = post.image;
    document.getElementById("imagePreview").style.display = "block";
    document.getElementById("uploadText").style.display = "none";
    document.getElementById("imageUploadArea").classList.add("has-image");
  } else {
    document.getElementById("imagePreview").style.display = "none";
    document.getElementById("uploadText").style.display = "block";
    document.getElementById("imageUploadArea").classList.remove("has-image");
  }

  document.getElementById("postModal").classList.add("show");
}

function deletePost(postId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const allPosts = getAllPosts();
      const updatedPosts = allPosts.filter((post) => post.id !== postId);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      const likedPosts =
        JSON.parse(localStorage.getItem(`liked_${loginUser.username}`)) || [];
      const updatedLikedPosts = likedPosts.filter((id) => id !== postId);
      localStorage.setItem(
        `liked_${loginUser.username}`,
        JSON.stringify(updatedLikedPosts)
      );

      displayPosts();

      Swal.fire("Deleted!", "Your post has been deleted.", "success");
    }
  });
}

function displayPosts() {
  const userPosts = getUserPosts();
  const postsGrid = document.getElementById("postsGrid");

  document.getElementById("postsCount").textContent = userPosts.length;
  const totalLikes = userPosts.reduce(
    (sum, post) => sum + (post.likes || 0),
    0
  );
  document.getElementById("totalLikes").textContent = totalLikes;

  if (userPosts.length === 0) {
    postsGrid.innerHTML = `
          <div class="no-posts">
            <h3>No posts yet</h3>
            <p>Share your first moment!</p>
          </div>
        `;
    return;
  }

  postsGrid.innerHTML = userPosts
    .map((post) => {
      const isLiked = isPostLikedByUser(post.id);
      return `
            <div class="post-card">
              <div class="post-actions">
                <button class="post-action-btn edit-btn" onclick="editPost(${
                  post.id
                })" title="Edit Post">✏️</button>
                <button class="post-action-btn delete-btn" onclick="deletePost(${
                  post.id
                })" title="Delete Post">🗑️</button>
              </div>
              <div class="post-image-container">
                ${
                  post.image
                    ? `<img src="${post.image}" alt="Post" class="post-card-image" />`
                    : `<div class="post-placeholder">📝</div>`
                }
              </div>
              <div class="post-card-content">
                <div class="post-caption">${post.content}</div>
                <div class="post-meta">
                  <span class="post-likes" onclick="toggleLike(${post.id})">
                    <span class="like-icon ${
                      isLiked ? "liked" : "not-liked"
                    }">❤️</span>
                    <span>${post.likes || 0}</span>
                  </span>
                  <span class="post-date">${post.time}</span>
                </div>
              </div>
            </div>
          `;
    })
    .join("");
}

function handlePostSubmit(caption, imageDataUrl) {
  let allPosts = getAllPosts();
  let successMessage = currentEditPostId
    ? "Post updated successfully! 📝"
    : "Post created successfully! 🎉";

  if (currentEditPostId) {
    // Logic for editing an existing post
    const postIndex = allPosts.findIndex((p) => p.id === currentEditPostId);
    if (postIndex !== -1) {
      allPosts[postIndex].content = caption;
      allPosts[postIndex].image = imageDataUrl;
    }
  } else {
    const newPost = {
      id: Date.now(),
      userId: loginUser.username,
      userProfilePic: loginUser.profilePic || defaultPic,
      content: caption,
      image: imageDataUrl,
      likes: 0,
      time: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
    allPosts.unshift(newPost);
  }

  localStorage.setItem("posts", JSON.stringify(allPosts));
  closePostModal();
  displayPosts();

  Swal.fire({
    icon: "success",
    title: "Success!",
    text: successMessage,
    timer: 1500,
    showConfirmButton: false,
  });
}

document.getElementById("postForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const caption = document.getElementById("postCaption").value.trim();
  if (!caption) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Post caption cannot be empty!",
    });
    return;
  }

  const imageFile = document.getElementById("postImageInput").files[0];

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      handlePostSubmit(caption, e.target.result);
    };
    reader.readAsDataURL(imageFile);
  } else {
    if (currentEditPostId) {
      const allPosts = getAllPosts();
      const post = allPosts.find((p) => p.id === currentEditPostId);
      handlePostSubmit(caption, post?.image || null);
    } else {
      handlePostSubmit(caption, null);
    }
  }
});

document.getElementById("bioForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const bio = document.getElementById("bioInput").value.trim();

  // 1. Get the current loggedInUser object from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // 2. Check if a user is actually logged in and the object exists
  if (loggedInUser) {
    // 3. Update the 'bio' property of the loggedInUser object
    loggedInUser.bio = bio;

    // 4. Save the ENTIRE updated loggedInUser object back to localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    // Optional: If you also have a list of all users and want to update the master list
    // This part is more complex and depends on your overall user management.
    // Assuming 'users' is an array of all registered users in localStorage
    /*
    let allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = allUsers.findIndex(user => user.username === loggedInUser.username);
    if (userIndex !== -1) {
        allUsers[userIndex].bio = bio;
        localStorage.setItem('users', JSON.stringify(allUsers));
    }
    */
  } else {
    // Handle the case where no user is logged in (though your initial check should prevent this)
    console.error("No user logged in to update bio.");
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Could not update bio. Please log in.",
      timer: 2000,
      showConfirmButton: false,
    });
    return; // Exit the function if no user is logged in
  }

  loadBio(); // Assuming loadBio() now reads from loggedInUser.bio
  closeBioModal();

  Swal.fire({
    icon: "success",
    title: "Updated! 🥳",
    text: "Your bio has been saved.",
    timer: 1500,
    showConfirmButton: false,
  });
});

// You'll also need to update your loadBio function to read from the loggedInUser object:
// Example of how loadBio() might look:
function loadBio() {
  const bioDisplayElement = document.getElementById("profileBio") // Assuming an element to display bio
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (bioDisplayElement && loggedInUser && loggedInUser.bio) {
    bioDisplayElement.textContent = loggedInUser.bio;
  } else if (bioDisplayElement) {
    bioDisplayElement.textContent = "No bio set yet."; // Or an empty string
  }
}

// Initial calls
loadBio();
displayPosts();
