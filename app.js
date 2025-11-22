// Check if user is logged in
const loginUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loginUser) {
  console.warn("No loggedInUser found. Creating dummy user for testing.");
  localStorage.setItem(
    "loggedInUser",
    JSON.stringify({ username: "TestUser", profilePic: "" })
  );
  window.location.reload();
}

const profileimg = document.getElementById("userImg");
profileimg.src =
  loginUser?.profilePic ||
  "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";

function handleProfileImg() {
  document.getElementById("drop-down").classList.toggle("show");
}

document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("drop-down");
  const logoutBtn = document.querySelector(".logout-btn");

  if (logoutBtn && dropdown && !logoutBtn.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

const logoutButton = document.getElementById("logoutBtn");
if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "./authfolder/login.html";
  });
}

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

let allPosts = JSON.parse(localStorage.getItem("posts")) || [
  {
    id: 1,
    username: "John Doe",
    userImage: "https://randomuser.me/api/portraits/men/1.jpg",
    content:
      "Just finished building an amazing project! Really excited to share it with everyone. 🚀",
    image: "https://picsum.photos/600/400?random=1",
    time: "2 hours ago",
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    username: "Jane Smith",
    userImage: "https://randomuser.me/api/portraits/women/2.jpg",
    content: "Beautiful sunset today! Nature never ceases to amaze me. 🌅",
    image: "https://picsum.photos/600/400?random=2",
    time: "5 hours ago",
    likes: 42,
    comments: 8,
  },
  {
    id: 3,
    username: "Mike Johnson",
    userImage: "https://randomuser.me/api/portraits/men/3.jpg",
    content:
      "Learning new things every day. The journey of continuous improvement never stops! 💪",
    time: "1 day ago",
    likes: 18,
    comments: 3,
  },
];

// Helper to save global posts state
function savePosts() {
  localStorage.setItem("posts", JSON.stringify(allPosts));
}

// --- LIKE LOGIC ---

// Check if the current logged-in user liked a specific post
function isPostLikedByUser(postId) {
  // Use a unique key for this user's likes
  const likedPostsKey = `liked_${loginUser.username}`;
  const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey)) || [];
  return likedPosts.includes(postId);
}

// Handle the like button click
function toggleLike(postId) {
  // 1. Find the post in the global 'allPosts' array
  const postIndex = allPosts.findIndex((p) => p.id === postId);

  if (postIndex !== -1) {
    // 2. Get the user's personal list of liked post IDs
    const likedPostsKey = `liked_${loginUser.username}`;
    let likedPosts = JSON.parse(localStorage.getItem(likedPostsKey)) || [];
    const isLiked = likedPosts.includes(postId);

    if (isLiked) {
      // Unlike logic: decrease count, remove ID from user list
      allPosts[postIndex].likes = Math.max(
        0,
        (allPosts[postIndex].likes || 0) - 1
      );
      likedPosts = likedPosts.filter((id) => id !== postId);
    } else {
      // Like logic: increase count, add ID to user list
      allPosts[postIndex].likes = (allPosts[postIndex].likes || 0) + 1;
      likedPosts.push(postId);
    }

    // 3. Save updated data to localStorage
    savePosts(); // Updates the main 'posts' item
    localStorage.setItem(likedPostsKey, JSON.stringify(likedPosts)); // Updates user's likes

    // 4. Re-render UI.
    // We trigger the search input event. This will re-run the filter logic
    // and call displayPosts with the correct data, maintaining current view/search.
    document.getElementById("searchInput").dispatchEvent(new Event("input"));
  }
}

// --- DISPLAY LOGIC ---

function displayPosts(posts) {
  const container = document.getElementById("postsContainer");

  if (posts.length === 0) {
    container.innerHTML = `
                    <div class="no-posts">
                        <h2>No posts found</h2>
                        <p>Try adjusting your search terms</p>
                    </div>
                `;
    return;
  }

  container.innerHTML = posts
    .map((post) => {
      // Determine if liked to set the correct heart icon
      const isLiked = isPostLikedByUser(post.id);
      const heartIcon = isLiked ? "❤️" : "🤍"; // Red if liked, white outline if not

      // FIX: Changed post.userId to post.username below to match data structure
      return `
                <div class="post-card">
                    <div class="post-header">
                        <img src="${
                          post.userImage ||
                          "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                        }" alt="${post.userId}" class="post-avatar" />
                        <div class="post-user-info">
                            <h3>${post.userId}</h3>
                            <span class="post-time">${post.time}</span>
                        </div>
                    </div>
                    <div class="post-content">
                        ${post.content}
                    </div>
                    ${
                      post.image
                        ? `<img src="${post.image}" alt="Post image" class="post-image" />`
                        : ""
                    }
                    <div class="post-actions">
                        <button class="post-action-btn" onclick="toggleLike(${
                          post.id
                        })">
                            ${heartIcon} ${post.likes || 0} Likes
                        </button>
                        <button class="post-action-btn">
                            💬 ${post.comments || 0} Comments
                        </button>
                        <button class="post-action-btn">
                            🔗 Share
                        </button>
                    </div>
                </div>
            `;
    })
    .join("");
}

// Search functionality
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase().trim();

  if (searchTerm === "") {
    displayPosts(allPosts);
    return;
  }

  const filteredPosts = allPosts.filter((post) => {
    // FIX: Changed post.userId to post.username to match data structure
    return (
      post.content.toLowerCase().includes(searchTerm) ||
      post.userId.toLowerCase().includes(searchTerm)
    );
  });

  displayPosts(filteredPosts);
});

// Initial display
// Trigger input event to ensure initial load respects any stuck search terms and renders correctly
searchInput.dispatchEvent(new Event("input"));
