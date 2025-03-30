document.addEventListener("DOMContentLoaded", () => {
    const createAARBtn = document.getElementById("createAARBtn");
    const dynastyFormContainer = document.getElementById("dynastyFormContainer");

    if (createAARBtn) {
        createAARBtn.addEventListener("click", () => {
            dynastyFormContainer.style.display = "block";
        });
    }
});
