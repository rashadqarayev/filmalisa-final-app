const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const profileImageFileInput = document.getElementById('profileImageFileInput');
const profileImageUrlInput = document.getElementById('profileImageUrlInput');
const profilePreview = document.getElementById('profilePreview');
const avatarWrapper = document.getElementById('avatarWrapper');

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='100' fill='%23222'/%3E%3Cpath d='M100 90c13.8 0 25-11.2 25-25S113.8 40 100 40 75 51.2 75 65s11.2 25 25 25zm0 15c-22.1 0-65 11.1-65 33v17h130v-17c0-21.9-42.9-33-65-33z' fill='%23555'/%3E%3C/svg%3E";

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
  });
}

if (avatarWrapper && profileImageFileInput) {
  avatarWrapper.addEventListener('click', () => {
    profileImageFileInput.click();
  });
}

if (profileImageFileInput && profilePreview) {
  profileImageFileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files && event.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      profileImageFileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      profilePreview.src = loadEvent.target?.result || defaultAvatar;
      if (profileImageUrlInput) {
        profileImageUrlInput.value = '';
      }
    };
    reader.readAsDataURL(selectedFile);
  });
}

if (profileImageUrlInput && profilePreview) {
  profileImageUrlInput.addEventListener('input', (event) => {
    const url = event.target.value.trim();

    if (!url) {
      profilePreview.src = defaultAvatar;
      return;
    }

    const img = new Image();
    img.onload = () => {
      profilePreview.src = url;
      if (profileImageFileInput) {
        profileImageFileInput.value = '';
      }
    };
    img.onerror = () => {
      console.warn('Invalid image URL or failed to load');
    };
    img.src = url;
  });
}
