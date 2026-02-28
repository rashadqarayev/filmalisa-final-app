(function () {
  var token = localStorage.getItem("admin_access_token");
  if (!token) {
    window.location.replace("/admin/html/login.html");
  }
})();
