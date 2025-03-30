document.addEventListener("DOMContentLoaded", () => {
    const dynastiesList = document.getElementById("dynasties-list");
    const addDynastyForm = document.getElementById("add-dynasty-form");

    const dynastyNameInput = document.getElementById("dynasty-name");
    const dynastyMottoInput = document.getElementById("dynasty-motto");
    const dynastyCoatOfArmsInput = document.getElementById("dynasty-coat-of-arms");

    function getDynasties() {
        return JSON.parse(localStorage.getItem("dynasties")) || [];
    }

    function saveDynasties(dynasties) {
        localStorage.setItem("dynasties", JSON.stringify(dynasties));
    }

    function renderDynasties() {
        if (!dynastiesList) return;
        dynastiesList.innerHTML = "";
        const dynasties = getDynasties();

        dynasties.forEach((dynasty, index) => {
            const dynastyItem = document.createElement("div");
            dynastyItem.classList.add("dynasty-card");
            dynastyItem.innerHTML = `
                <h3>${dynasty.nazwa}</h3>
                <img src="${dynasty.herb}" alt="Herb ${dynasty.nazwa}" style="width: 100px;">
                <p>${dynasty.motto}</p>
                <button class="delDynBtn" onclick="deleteDynasty(${index})">Usuń</button>
            `;
            dynastiesList.appendChild(dynastyItem);
        });
    }

    if (addDynastyForm) {
        addDynastyForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const file = dynastyCoatOfArmsInput.files[0];
            if (!file) {
                alert("Wybierz plik graficzny!");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const newDynasty = {
                    nazwa: dynastyNameInput.value,
                    motto: dynastyMottoInput.value,
                    herb: e.target.result,
                    władcy: []
                };

                const dynasties = getDynasties();
                dynasties.push(newDynasty);
                saveDynasties(dynasties);

                addDynastyForm.reset();
                renderDynasties();
            };

            reader.readAsDataURL(file);
        });
    }

    window.deleteDynasty = (index) => {
        let dynasties = getDynasties();
        dynasties.splice(index, 1);
        saveDynasties(dynasties);
        renderDynasties();
    };

    renderDynasties();
});
