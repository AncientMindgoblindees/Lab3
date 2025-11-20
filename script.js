document.addEventListener('DOMContentLoaded', function () {
    // SVG Circuit switch logic for landing page
    const switchBtn = document.getElementById('switch');
    const svgSwitch = document.getElementById('svg-switch');
    const switchLever = document.getElementById('switch-lever');
    const ledGlow = document.getElementById('led-glow');
    const batteryBar = document.getElementById('battery-bar');
    const batteryLabel = document.getElementById('battery-label');

    function animateBatteryAndTransition() {
        let width = 100;
        const duration = 1200; // ms
        const steps = 30;
        const interval = duration / steps;
        // Animate lever to closed position
        switchLever.setAttribute('x2', '180');
        switchLever.setAttribute('y2', '90');
        // Glow the LED
        if (ledGlow) ledGlow.setAttribute('opacity', '1');
        // Animate battery bar and label
        let currentStep = 0;
        function animate() {
            currentStep++;
            width = 100 - (currentStep / steps) * 100;
            if (batteryBar) batteryBar.style.width = width + '%';
            if (batteryLabel) {
                const percent = Math.max(0, Math.round(width));
                batteryLabel.textContent = percent + '% battery charge';
            }
            if (currentStep < steps) {
                setTimeout(animate, interval);
            } else {
                if (batteryBar) batteryBar.style.width = '0%';
                if (batteryLabel) batteryLabel.textContent = '0% battery charge';
                setTimeout(() => {
                    window.location.href = 'profiles.html';
                }, 200);
            }
        }
        animate();
    }

    if (switchBtn && svgSwitch && switchLever && ledGlow && batteryBar) {
        switchBtn.addEventListener('click', animateBatteryAndTransition);
        svgSwitch.addEventListener('click', animateBatteryAndTransition);
    }
});
