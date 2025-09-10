const Router = {
  showView(viewName) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add("active");

    document.querySelectorAll(".content-view").forEach((v) => {
      v.classList.remove("active");
    });

    if (viewName === "posts") {
      document.getElementById("posts-view").classList.add("active");
    } else if (viewName === "create") {
      this.showEditView();
    }
  },

  showEditView(postId = null) {
    document.getElementById("edit-view").classList.add("active");
    document.getElementById("posts-view").classList.remove("active");

    if (postId) {
      const post = appState.posts.find((p) => p.id === postId);
      if (post) {
        console.log("Editing post:", postId);
        document.getElementById("edit-title").textContent = "Edit Post";
        document.getElementById("submit-btn").textContent = "Update Post";
        document.getElementById("edit-post-id").value = postId;
        document.getElementById("post-title").value = post.title;
        document.getElementById("post-body").value = post.body;
        appState.editingPostId = postId;
      }
    } else {
      document.getElementById("edit-title").textContent = "Create New Post";
      document.getElementById("submit-btn").textContent = "Create Post";
      document.getElementById("edit-post-id").value = "";
      document.getElementById("post-title").value = "";
      document.getElementById("post-body").value = "";
      appState.editingPostId = null;
    }

    this.clearFormErrors();
  },

  clearFormErrors() {
    document.getElementById("title-error").textContent = "";
    document.getElementById("body-error").textContent = "";
  },
};
