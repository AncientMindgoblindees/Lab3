// profile.js
// Centralized script to load profile image and bio for any profile page

document.addEventListener('DOMContentLoaded', function() {
  // Get profile name from body data attribute or URL
  let profile = document.body.getAttribute('data-profile');
  if (!profile) {
    // Try to infer from URL, e.g. /html/tj.html => tj
    const match = window.location.pathname.match(/\/([a-zA-Z0-9_-]+)\.html$/);
    profile = match ? match[1] : null;
  }
  if (!profile) return;

  // Load bio from server
  fetch(`/assets/save_bio.php?profile=${profile}`)
    .then(res => res.json())
    .then(data => {
      const bioDisplay = document.getElementById('bio-display');
      if (bioDisplay) {
        bioDisplay.textContent = (data.success && data.bio !== undefined) ? data.bio : 'No biography available.';
      }
    });

  // Load image from server
  const imgPreview = document.getElementById('img-preview');
  if (imgPreview) {
    const exts = ['jpg', 'png', 'gif'];
    function tryLoad(extIdx) {
      if (extIdx >= exts.length) {
        imgPreview.style.display = 'none';
        return;
      }
      const url = `/assets/images/${profile}.${exts[extIdx]}`;
      fetch(url, {method: 'HEAD'}).then(function(res) {
        if (res.ok) {
          imgPreview.src = url + '?t=' + Date.now();
          imgPreview.style.display = 'block';
        } else {
          tryLoad(extIdx + 1);
        }
      });
    }
    tryLoad(0);
  }
});
