
// This encryption function was copied from ChatGPT
// Compute SHA-256 hash of a string and return hex string
async function sha256(message) {
    if (window.crypto && window.crypto.subtle) {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    } else {
        // Fallback: Use a JS implementation if crypto.subtle is unavailable
        return sha256_fallback(message);
    }
}

// Fallback SHA-256 implementation (from https://geraintluff.github.io/sha256/)
function sha256_fallback(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32-amount));
    }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var result = "";
    var words = [], asciiBitLength = ascii.length*8;
    var hash = sha256_fallback.h = sha256_fallback.h || [];
    var k = sha256_fallback.k = sha256_fallback.k || [];
    var primeCounter = k.length;
    var i, j;
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    ascii += '\x80';
    while (ascii.length%64 - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check
        words[i>>2] |= j << ((3-i)%4)*8;
    }
    words[words.length] = ((asciiBitLength/maxWord)|0);
    words[words.length] = (asciiBitLength);
    for (j = 0; j < words.length; ) {
        var w = words.slice(j, j += 16);
        var oldHash = hash.slice(0);
        for (i = 0; i < 64; i++) {
            var w15 = w[i-15], w2 = w[i-2];
            var a = hash[0], e = hash[4];
            if (i < 16) w[i] = w[i] || 0;
            else w[i] = ((rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) +
                        w[i-7] +
                        (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) +
                        w[i-16])|0;
            var t1 = hash[7] +
                (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
                ((e&hash[5])^((~e)&hash[6])) +
                k[i] + w[i];
            var t2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
                ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
            hash = [(t1+t2)|0].concat(hash);
            hash[4] = (hash[4]+t1)|0;
        }
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i]+oldHash[i])|0;
        }
    }
    for (i = 0; i < 8; i++) {
        for (j = 3; j+1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b>>4).toString(16)) + ((b&15).toString(16));
        }
    }
    return result;
}

async function requestPassword() {
    const pwd = prompt("Enter password to access protected content:");
    if (pwd === null) {
        // User cancelled the prompt
        return;
    }
    try {
        const enteredHash = await sha256(pwd);

        if (enteredHash === PASSWORD_HASH) {
            sessionStorage.setItem("auth", "true"); // Set authentication flag in session storage
            window.location.href = "/html/protected.html";
        } else {
            alert("Incorrect password. Please try again.");
        }
    } catch (e) {
        console.error("Error while hashing password:", e);
        alert("Sorry, something went wrong with the password check.");
    }
}

document.querySelectorAll('.profile-card').forEach(card => {
  card.addEventListener('click', function() {
    const profile = card.getAttribute('data-profile');
    window.location.href = `/html/${profile}.html`;
  });
});

document.getElementById('save-bio').onclick = function() {
    const bioInput = document.getElementById('bio');
    if (bioInput) {
        const bio = bioInput.value;
        localStorage.setItem('userBio', bio);
        alert('Biography saved!');
    }
};
// Load saved bio on page load
const bioInput = document.getElementById('bio');
if (bioInput) {
    bioInput.value = localStorage.getItem('userBio') || '';
}


//Protected Content JS

// Utility to handle image preview and saving for all profiles
function setupProfileImageInput(imgInputId, imgPreviewId, profileName) {
    const input = document.getElementById(imgInputId);
    const preview = document.getElementById(imgPreviewId);
    const exts = ['jpg', 'png', 'gif'];
    function tryLoad(extIdx) {
        if (extIdx >= exts.length) {
            preview.style.display = 'none';
            return;
        }
        var url = `/assets/images/${profileName}.${exts[extIdx]}`;
        fetch(url, {method: 'HEAD'}).then(function(res) {
            if (res.ok) {
                preview.src = url + '?t=' + Date.now();
                preview.style.display = 'block';
            } else {
                tryLoad(extIdx + 1);
            }
        });
    }
    tryLoad(0);
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profileImg', file);
            formData.append('profile', profileName);
            fetch('/assets/upload_image.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    tryLoad(0);
                    alert('Image uploaded successfully!');
                } else {
                    alert('Upload failed: ' + data.message);
                }
            })
            .catch(err => {
                alert('Error uploading image: ' + err);
            });
        }
    });
}

// Utility to handle biography saving/loading
function setupBioInput(bioInputId, saveBtnId, storageKey) {
    const textarea = document.getElementById(bioInputId);
    const saveBtn = document.getElementById(saveBtnId);
    textarea.value = localStorage.getItem(storageKey) || '';
    saveBtn.onclick = function() {
        localStorage.setItem(storageKey, textarea.value);
        alert('Biography saved!');
    };
}