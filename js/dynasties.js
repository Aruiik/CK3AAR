// FORMULARZ DO DODAWANIA DYNASTII (NAZWA DYNASTII, MOTTO DYNASTII, HERB DYNASTII, GRAFIKA)

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
    
            const rulersList = dynasty.władcy.map(ruler => `
                <li><strong>${ruler.imie}</strong> (${ruler.okres}): ${ruler.opis}</li>
            `).join("");
    
            dynastyItem.innerHTML = `
            <div class="dynasty-grid">
                <div class="dynasty-info">
                    <h3>${dynasty.nazwa}</h3>
                    <img src="${dynasty.herb}" alt="Herb ${dynasty.nazwa}" style="width: 100px;">
                    <p>${dynasty.motto}</p>
                </div>
                <div class="rulers-list">
                    ${dynasty.władcy.map(ruler => `
                        <div class="ruler-card">
                            ${ruler.herbRodu ? `<img src="${ruler.herbRodu}" alt="Herb władcy" style="width: 80px;">` : ""}
                            <p><strong>${ruler.imie}</strong></p>
                            <p>${ruler.opis}</p>
                            <p><em>${ruler.okres}</em></p>
                            ${ruler.mapka ? `<img src="${ruler.mapka}" alt="Mapa" style="width: 100px;">` : ""}
                        </div>
                    `).join("")}
                </div>
            </div>
        
            <form class="add-ruler-form" data-index="${index}">
                <input type="text" name="ruler-name" placeholder="Imię władcy" required>
                <input type="text" name="ruler-period" placeholder="Okres panowania" required>
                <input type="text" name="ruler-description" placeholder="Opis rządów" required>
                <input type="text" name="ruler-herb" placeholder="URL herbu rodu (opcjonalnie)">
                <input type="text" name="ruler-map" placeholder="URL mapy zasięgu (opcjonalnie)">
                <button type="submit">Dodaj władcę</button>
            </form>

        
            <button class="delDynBtn" onclick="deleteDynasty(${index})">Usuń dynastię</button>
        `;
        
    
            dynastiesList.appendChild(dynastyItem);
        });
    
        // OBSŁUGA DODAWANIA WŁADCÓW DO DYNASTII
        document.querySelectorAll(".add-ruler-form").forEach(form => {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const index = e.target.getAttribute("data-index");
                const dynasties = getDynasties();
    
                const rulerName = form.querySelector('[name="ruler-name"]').value;
                const rulerPeriod = form.querySelector('[name="ruler-period"]').value;
                const rulerDescription = form.querySelector('[name="ruler-description"]').value;
    
                const rulerHerb = form.querySelector('[name="ruler-herb"]').value;
                const rulerMap = form.querySelector('[name="ruler-map"]').value;
                
                const newRuler = {
                    imie: rulerName,
                    okres: rulerPeriod,
                    opis: rulerDescription,
                    herbRodu: rulerHerb || null,
                    mapka: rulerMap || null
                };
                
    
                dynasties[index].władcy.push(newRuler);
                saveDynasties(dynasties);
                renderDynasties();
            });
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
