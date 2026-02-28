
// // ===== register API =====
// const form = document.querySelector('.register-form');
// const warningEl = document.getElementById('warning');

// // Write the URL from Postman here:
// const registerUrl = 'https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup';

// function showWarning(text) {
//   warningEl.textContent = text;
//   warningEl.style.display = 'block';
// }

// function hideWarning() {
//   warningEl.textContent = '';
//   warningEl.style.display = 'none';
// }

// async function registerUser(e) {
//   e.preventDefault();
//   hideWarning();

//   const fullName = document.getElementById('fullname').value.trim();
//   const email = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value;

//   if (!fullName || !email || !password) {
//     showWarning('Please fill in all fields');
//     return;
//   }

//   const options = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       password: password,
//       full_name: fullName,
//       email: email,
//     }),
//   };

//   try {
//     const response = await fetch(registerUrl, options);
//     const data = await response.json();

//     if (!response.ok || data.result === false) {
//       // for example: "User is already exists"
//       showWarning(data.message || 'Registration failed');
//       return;
//     }

//     // successful registration → redirect to login
//     window.location.href = './login.html';
//   } catch (err) {
//     showWarning('Server error');
//   }
// }

// form.addEventListener('submit', registerUser);



















const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');

const gmailFromQuery = new URLSearchParams(window.location.search).get('gmail');
if (emailInput && gmailFromQuery) {
  emailInput.value = gmailFromQuery;
}

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
  
  });
}
