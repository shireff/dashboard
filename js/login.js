const formValidator = {
  checkEmail(email) {
    return email.includes("@") && email.includes(".");
  },
  checkPassword(password) {
    return password.length >= 6;
  },
  showErr(fieldId, message) {
    document.getElementById(fieldId + "-error").textContent = message;
  },
  clearErr(fieldId) {
    document.getElementById(fieldId + "-error").textContent = "";
  },
};

const VALID_EMAIL = "test@test.com";
const VALID_PASS = "123456";
const errorState = document.getElementById("error-state");

const login = () => {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const passwordEl = document.getElementById("password");
    const email = document.getElementById("email").value.trim();
    const password = passwordEl.value.trim();

    formValidator.clearErr("email");
    formValidator.clearErr("password");

    let ok = true;

    if (!formValidator.checkEmail(email)) {
      formValidator.showErr("email", "Please enter a valid email");
      ok = false;
    }
    if (!formValidator.checkPassword(password)) {
      formValidator.showErr("password", "Password must be 6+ chars");
      ok = false;
    }

    if (!ok) return;

    if (email === VALID_EMAIL && password === VALID_PASS) {
      Auth.login(email);
      window.location.href = "../dashboard.html";
    } else {
      errorState.classList.remove("hidden");
      passwordEl.value = "";
      passwordEl.focus();
    }
  });
};

document.addEventListener("DOMContentLoaded", login);
