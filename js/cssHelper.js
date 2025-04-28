document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.previewImgs').forEach((el, index) => {
        el.style.animationDelay = (index * 0.1) + 's';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.previews').forEach((el, index) => {
        el.style.animationDelay = (index * 0.1) + 's';
    });
});
