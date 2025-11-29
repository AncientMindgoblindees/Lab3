function requestPassword() {
    const pwd = prompt("Enter password to access protected content:");

    if (pwd !== null) {
        console.log("Password entered:", pwd);
        window.location.href = "protected.html";
    }
}