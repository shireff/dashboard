const PostsManager = {
  async loadPosts() {
    try {
      appState.isLoading = true;
      this.toggleState(
        ["loading-state"], // show loading state
        ["error-state", "empty-state", "posts-table-container"] // hide other states
      );

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const posts = await response.json();
      appState.posts = posts;
      appState.filteredPosts = [...posts];

      this.refreshPosts();
      this.toggleState([], ["loading-state"]); // hide loading state
    } catch (error) {
      console.log("Error loading posts", error);
      this.toggleState(
        ["error-state"],
        ["loading-state", "empty-state", "posts-table-container"]
      );
    } finally {
      appState.isLoading = false;
    }
  },

  toggleState(showIds = [], hideIds = []) {
    showIds.forEach((id) =>
      document.getElementById(id).classList.remove("hidden")
    );
    hideIds.forEach((id) =>
      document.getElementById(id).classList.add("hidden")
    );
  },

  applyFiltersAndSort() {
    let filtered = [...appState.posts];

    if (appState.searchQuery.trim()) {
      const query = appState.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
      );
    }

    const [sortField, sortOrder] = appState.sortBy.split("-");
    filtered.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });

    appState.filteredPosts = filtered;
    appState.currentPage = 1;
  },

  renderPosts() {
    const start = (appState.currentPage - 1) * appState.pageSize;
    const posts = appState.filteredPosts.slice(
      start,
      start + appState.pageSize
    );

    if (!appState.filteredPosts.length) {
      this.toggleState(["empty-state"], ["posts-table-container"]);
      return;
    } else {
      this.toggleState(["posts-table-container"], ["empty-state"]);
    }

    const tbody = document.getElementById("posts-table-body");
    tbody.innerHTML = "";

    posts.forEach((post) => {
      const row = document.createElement("tr");

      const postContent =
        post.body.length > 100
          ? post.body.substring(0, 100) + "..."
          : post.body;

      row.innerHTML = `
        <td>${post.id}</td>
      <td class="post-title">${post.title}</td>
      <td class="post-content">${postContent}</td>
        <td class="post-actions">
            <button class="btn btn-small" onclick="PostsManager.editPost(${post.id})">Edit</button>
            <button class="btn btn-small btn-danger" onclick="PostsManager.deletePost(${post.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    this.updatePaginationInfo();
  },

  updatePaginationInfo() {
    const totalPages = Math.ceil(
      appState.filteredPosts.length / appState.pageSize
    );

    document.getElementById("current-page").textContent = appState.currentPage;
    document.getElementById("total-pages").textContent = totalPages;
    document.getElementById("total-posts").textContent =
      appState.filteredPosts.length;

    document.getElementById("prev-page").disabled = appState.currentPage === 1;
    document.getElementById("next-page").disabled =
      appState.currentPage === totalPages || totalPages === 0;
  },

  refreshPosts() {
    this.applyFiltersAndSort();
    this.renderPosts();
  },

  previousPage() {
    if (appState.currentPage > 1) {
      appState.currentPage--;
      this.renderPosts();
    }
  },

  nextPage() {
    const totalPages = Math.ceil(
      appState.filteredPosts.length / appState.pageSize
    );
    if (appState.currentPage < totalPages) {
      appState.currentPage++;
      this.renderPosts();
    }
  },

  changePageSize(newSize) {
    appState.pageSize = parseInt(newSize);
    appState.currentPage = 1;
    this.renderPosts();
  },

  search(query) {
    appState.searchQuery = query;
    this.refreshPosts();
  },

  sort(sortBy) {
    appState.sortBy = sortBy;
    this.refreshPosts();
  },

  editPost(postId) {
    Router.showEditView(postId);
  },

  deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
      appState.posts = appState.posts.filter((post) => post.id !== postId);
      this.refreshPosts();
    }
  },

  createPost(title, body) {
    const newPost = {
      id: appState.generateId(),
      title: title,
      body: body,
      userId: 1,
    };

    appState.posts.unshift(newPost);
    this.applyFiltersAndSort();
    this.renderPosts();

    return newPost;
  },

  updatePost(postId, title, body) {
    const postIndex = appState.posts.findIndex((post) => post.id === postId);
    if (postIndex !== -1) {
      appState.posts[postIndex].title = title;
      appState.posts[postIndex].body = body;

      this.refreshPosts();

      return appState.posts[postIndex];
    }
    return null;
  },
};
