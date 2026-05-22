// Background Effects - Vanta.js 3D Network Integration
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Vanta.js NET effect on the #vanta-bg container
    if (window.VANTA && document.getElementById('vanta-bg')) {
        VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0xa855f7, // Purple network lines
            backgroundColor: 0x050510, // Deep dark background
            points: 12.00,
            maxDistance: 22.00,
            spacing: 18.00,
            showDots: true
        });
    } else {
        console.warn('Vanta.js or #vanta-bg container not found.');
    }
});
