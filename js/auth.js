const Auth = {
  isAuthenticated() {
    return localStorage.getItem("dashboardAuthToken") === "authenticated";
  },

  login(email) {
    localStorage.setItem("dashboardAuthToken", "authenticated");
  },

  logout() {
    localStorage.removeItem("dashboardAuthToken");
  },

};
