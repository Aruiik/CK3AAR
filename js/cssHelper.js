document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.previewImgs').forEach((el, index) => {
        el.style.animationDelay = (index * 0.1) + 's';
    });
});
