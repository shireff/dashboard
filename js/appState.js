const appState = {
  posts: [],
  filteredPosts: [],
  currentPage: 1,
  pageSize: 10,
  searchQuery: "",
  sortBy: "id-asc",
  isLoading: false,
  editingPostId: null,
  generateId() {
    return Math.max(...this.posts.map((p) => p.id), 0) + 1;
  },
};
