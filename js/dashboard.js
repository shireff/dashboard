const logout = () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      Auth.logout();
      location.href = "../index.html";
    };
  }
};

const navLinks = () => {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.onclick = (e) => {
      e.preventDefault();
      Router.showView(link.getAttribute("data-view"));
    };
  });
};

const createAndBackButtons = () => {
  const createBtn = document.getElementById("create-post-btn");
  if (createBtn) createBtn.onclick = () => Router.showView("create");

  const backBtn = document.getElementById("back-to-posts");
  if (backBtn) backBtn.onclick = () => Router.showView("posts");
};

const filters = () => {
  const searchInput = document.getElementById("search-input");
  if (searchInput)
    searchInput.oninput = (e) => PostsManager.search(e.target.value);

  const pageSizeSelect = document.getElementById("page-size-select");
  if (pageSizeSelect)
    pageSizeSelect.onchange = (e) =>
      PostsManager.changePageSize(e.target.value);

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect)
    sortSelect.onchange = (e) => PostsManager.sort(e.target.value);
};

const paginationButtons = () => {
  const prev = document.getElementById("prev-page");
  if (prev) prev.onclick = () => PostsManager.previousPage();

  const next = document.getElementById("next-page");
  if (next) next.onclick = () => PostsManager.nextPage();
};

const retryButton = () => {
  const retry = document.getElementById("retry-btn");
  if (retry) retry.onclick = () => PostsManager.loadPosts();
};

const postForm = () => {
  const form = document.getElementById("post-form");
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const title = document.getElementById("post-title").value.trim();
      const body = document.getElementById("post-body").value.trim();
      const postId = document.getElementById("edit-post-id").value;

      Router.clearFormErrors();

      if (title.length < 3) {
        document.getElementById("title-error").innerText = "Title too short";
        return;
      }
      if (body.length < 10) {
        document.getElementById("body-error").innerText = "Content too short";
        return;
      }

      if (postId) {
        PostsManager.updatePost(+postId, title, body);
      } else {
        PostsManager.createPost(title, body);
      }
      Router.showView("posts");
    };
  }
};

const resetButton = () => {
  const reset = document.getElementById("reset-btn");
  if (reset) {
    reset.onclick = () => {
      if (appState.editingPostId) {
        const post = appState.posts.find(
          (p) => p.id === appState.editingPostId
        );
        if (post) {
          document.getElementById("post-title").value = post.title;
          document.getElementById("post-body").value = post.body;
        }
      } else {
        document.getElementById("post-title").value = "";
        document.getElementById("post-body").value = "";
      }
      Router.clearFormErrors();
    };
  }
};

const cancelButton = () => {
  const cancel = document.getElementById("cancel-btn");
  if (cancel) cancel.onclick = () => Router.showView("posts");
};

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.isAuthenticated()) {
    location.href = "../index.html";
    return;
  }

  logout();
  navLinks();
  createAndBackButtons();
  filters();
  paginationButtons();
  retryButton();
  postForm();
  resetButton();
  cancelButton();

  PostsManager.loadPosts();
});
