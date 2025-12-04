// Check authentication for protected content
function checkProtectedAuth() {
    if (!sessionStorage.getItem('auth') || sessionStorage.getItem('auth') !== 'true') {
        window.location.href = '/html/teammates.html'; // Redirect to login or home
    }
}

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
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'password-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;

    // Create modal dialog
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 16px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        border-top: 4px solid #ffd700;
    `;

    modal.innerHTML = `
        <h2 style="color: #ffd700; margin: 0 0 10px 0; font-family: 'Montserrat', sans-serif; font-size: 1.3rem;">
            🔒 Protected Area
        </h2>
        <p style="color: #888; margin: 0 0 20px 0; font-size: 0.9rem;">
            Enter the password to access admin content.
        </p>
        <div style="position: relative; margin-bottom: 20px;">
            <input type="password" id="password-input" placeholder="Enter password" 
                style="width: 100%; background: #111; color: #fff; border: 1px solid #333; 
                border-radius: 8px; padding: 14px 50px 14px 14px; font-family: 'Open Sans', sans-serif;
                font-size: 1rem; box-sizing: border-box;"
            />
            <button type="button" id="toggle-password" 
                style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                background: none; border: none; color: #888; cursor: pointer; padding: 5px;
                font-size: 1.2rem;" title="Show password">
                👁️
            </button>
        </div>
        <div id="password-error" style="color: #f44; margin-bottom: 15px; font-size: 0.85rem; display: none;"></div>
        <div style="display: flex; gap: 10px;">
            <button id="password-cancel" 
                style="flex: 1; background: #333; color: #fff; border: none; padding: 12px 20px;
                border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.3s;">
                Cancel
            </button>
            <button id="password-submit" 
                style="flex: 1; background: #ffd700; color: #000; border: none; padding: 12px 20px;
                border-radius: 6px; font-weight: 700; cursor: pointer; transition: background 0.3s;">
                Submit
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus the input
    const passwordInput = document.getElementById('password-input');
    const toggleBtn = document.getElementById('toggle-password');
    const errorDiv = document.getElementById('password-error');
    const cancelBtn = document.getElementById('password-cancel');
    const submitBtn = document.getElementById('password-submit');

    passwordInput.focus();

    // Toggle password visibility
    toggleBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = '🙈';
            toggleBtn.title = 'Hide password';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = '👁️';
            toggleBtn.title = 'Show password';
        }
        passwordInput.focus();
    });

    // Handle submit
    const handleSubmit = async () => {
        const pwd = passwordInput.value;
        if (!pwd) {
            errorDiv.textContent = 'Please enter a password.';
            errorDiv.style.display = 'block';
            passwordInput.focus();
            return;
        }

        submitBtn.textContent = 'Checking...';
        submitBtn.disabled = true;

        try {
            const enteredHash = await sha256(pwd);

            if (enteredHash === PASSWORD_HASH) {
                sessionStorage.setItem("auth", "true");
                overlay.remove();
                window.location.href = "/html/protected.html";
            } else {
                errorDiv.textContent = 'Incorrect password. Please try again.';
                errorDiv.style.display = 'block';
                passwordInput.value = '';
                passwordInput.type = 'password';
                toggleBtn.textContent = '👁️';
                passwordInput.focus();
                submitBtn.textContent = 'Submit';
                submitBtn.disabled = false;
            }
        } catch (e) {
            console.error("Error while hashing password:", e);
            errorDiv.textContent = 'Something went wrong. Please try again.';
            errorDiv.style.display = 'block';
            submitBtn.textContent = 'Submit';
            submitBtn.disabled = false;
        }
    };

    // Handle cancel
    const handleCancel = () => {
        overlay.remove();
    };

    // Event listeners
    submitBtn.addEventListener('click', handleSubmit);
    cancelBtn.addEventListener('click', handleCancel);

    // Submit on Enter key
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    });

    // Close on overlay click (outside modal)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            handleCancel();
        }
    });
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
