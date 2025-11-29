function requestPassword() {
    const pwd = prompt("Enter password to access protected content:");

    // Temporary behavior — will be replaced with hashing + AES later
    if (pwd !== null) {
        console.log("Password entered:", pwd);
        window.location.href = "protected.html";   // placeholder page
    }
}