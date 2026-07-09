/*
=========================================
 FrostFlow
 Smart Ice Factory Management System
=========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginBtn = document.getElementById("loginBtn");

    /*====================================
      SHOW / HIDE PASSWORD
    ====================================*/

    togglePassword.addEventListener("click", () => {

        const icon = togglePassword.querySelector("i");

        if (password.type === "password") {

            password.type = "text";

            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");

        } else {

            password.type = "password";

            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");

        }

    });

    /*====================================
      LOGIN
    ====================================*/

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const username = loginForm.querySelector("input[type='text']").value.trim();
        const userPassword = password.value.trim();

        // Validation

        if (username === "" || userPassword === "") {

            showAlert(
                "Please enter your username and password.",
                "danger"
            );

            return;

        }

        // Loading Button

        loginBtn.disabled = true;

        loginBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"></span>
            Signing In...
        `;

        // Simulate Login

        setTimeout(() => {

            showAlert(
                "Login Successful!",
                "success"
            );

            loginBtn.innerHTML = `
                <i class="bi bi-check-circle me-2"></i>
                Success
            `;

            // Redirect after success

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1000);

        }, 1800);

    });

});

/*====================================
  Bootstrap Alert
====================================*/

function showAlert(message, type) {

    // Remove old alert

    const oldAlert = document.querySelector(".floating-alert");

    if (oldAlert) {

        oldAlert.remove();

    }

    const alert = document.createElement("div");

    alert.className = `alert alert-${type} alert-dismissible fade show floating-alert`;

    alert.innerHTML = `

        ${message}

        <button
            class="btn-close"
            data-bs-dismiss="alert">
        </button>

    `;

    document.body.appendChild(alert);

    setTimeout(() => {

        alert.remove();

    }, 3000);

}