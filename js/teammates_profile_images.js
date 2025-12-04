// teammates_profile_images.js
// Loads profile images and majors into teammates.html profile cards

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.profile-card').forEach(card => {
    const profile = card.getAttribute('data-profile');
    const imgSlot = card.querySelector('.profile-img-slot');
    const majorSlot = document.getElementById(`major-${profile}`);
    
    // Load profile image
    if (imgSlot) {
      const exts = ['jpg', 'png', 'gif'];
      function tryLoad(extIdx) {
        if (extIdx >= exts.length) {
          imgSlot.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#333;font-size:3rem;">👤</div>';
          return;
        }
        const url = `/assets/images/${profile}.${exts[extIdx]}`;
        fetch(url, {method: 'HEAD'}).then(function(res) {
          if (res.ok) {
            imgSlot.innerHTML = `<img src="${url}?t=${Date.now()}" alt="${profile} profile" style="width:100%;height:100%;object-fit:cover;" />`;
          } else {
            tryLoad(extIdx + 1);
          }
        });
      }
      tryLoad(0);
    }
    
    // Load major/info
    if (majorSlot) {
      fetch(`/assets/save_major.php?profile=${encodeURIComponent(profile)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.major) {
            majorSlot.textContent = data.major;
          } else {
            majorSlot.textContent = '';
          }
        });
    }
  });
});
