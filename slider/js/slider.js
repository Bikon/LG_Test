const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let isActivityDetected = false;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = i === index ? 'translateY(-100%)' : 'translateY(0)';
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

function previousSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
}

function activityDetected() {
    isActivityDetected = true;
    setTimeout(() => isActivityDetected = false, 15000);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
        nextSlide();
        activityDetected();
    } else if (event.key === 'ArrowUp') {
        previousSlide();
        activityDetected();
    }
});

setInterval(() => {
    if (!isActivityDetected) {
        nextSlide();
    }
}, 15000);

// Initial display
showSlide(currentIndex);