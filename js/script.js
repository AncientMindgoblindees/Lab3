// This encryption function was copied from ChatGPT
// Compute SHA-256 hash of a string and return hex string
async function sha256(message) {
    const msgUint8 = new TextEncoder().encode(message);           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
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
