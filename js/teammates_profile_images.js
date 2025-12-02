// teammates_profile_images.js
// Loads profile images into teammates.html profile cards

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.profile-card').forEach(card => {
    const profile = card.getAttribute('data-profile');
    const imgSlot = card.querySelector('.profile-img-slot');
    if (!imgSlot) return;
    const exts = ['jpg', 'png', 'gif'];
    function tryLoad(extIdx) {
      if (extIdx >= exts.length) {
        imgSlot.innerHTML = '';
        return;
      }
      const url = `/assets/images/${profile}.${exts[extIdx]}`;
      fetch(url, {method: 'HEAD'}).then(function(res) {
        if (res.ok) {
          imgSlot.innerHTML = `<img src="${url}?t=${Date.now()}" alt="${profile} profile" style="width:80px;height:80px;border-radius:50%;border:2px solid #ffd700;background:#222;object-fit:cover;" />`;
        } else {
          tryLoad(extIdx + 1);
        }
      });
    }
    tryLoad(0);
  });
});
