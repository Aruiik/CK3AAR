// FORMULARZ DO DODAWANIA DYNASTII (NAZWA DYNASTII, MOTTO DYNASTII, HERB DYNASTII, GRAFIKA)

let currentDynastyIndex = null;
let editMode = false;
let editDynastyIdx = null;
let editRulerIdx = null;

function openAddRulerModal(dynastyIndex) {
    currentDynastyIndex = dynastyIndex;
    editMode = false;
    // Pobierz ostatniego władcę tej dynastii
    const dynasties = JSON.parse(localStorage.getItem("dynasties")) || [];
    const rulers = dynasties[dynastyIndex]?.władcy || [];
    let minYear = '';
    if (rulers.length > 0) {
        // Zakładamy, że okres to liczby, np. "100-150"
        const lastRuler = rulers[rulers.length - 1];
        let lastTo = 0;
        if (lastRuler.okres) {
            // Jeśli stary format: "100-150"
            const match = lastRuler.okres.match(/(\d+)\D+(\d+)/);
            if (match) lastTo = parseInt(match[2]);
        }
        if (lastRuler.okresDo) {
            // Jeśli nowy format
            lastTo = parseInt(lastRuler.okresDo);
        }
        minYear = lastTo;
    }
    // Ustaw min na input
    const fromInput = document.querySelector('#add-ruler-popup-form [name="ruler-period-from"]');
    if (fromInput) {
        fromInput.min = minYear ? (minYear + 1) : '';
        fromInput.value = minYear ? (minYear + 1) : '';
    }
    document.getElementById('rulerSubmitBtn').textContent = "Dodaj władcę";
    document.getElementById('addRulerModal').style.display = 'block';
}

function openEditRulerModal(dynastyIdx, rulerIdx) {
    editMode = true;
    editDynastyIdx = dynastyIdx;
    editRulerIdx = rulerIdx;

    const dynasties = JSON.parse(localStorage.getItem("dynasties")) || [];
    const ruler = dynasties[dynastyIdx].władcy[rulerIdx];

    // Wypełnij formularz danymi
    const form = document.getElementById('add-ruler-popup-form');
    form['ruler-name'].value = ruler.imie || '';
    if (ruler.okresOd) {
        form['ruler-period-from'].value = ruler.okresOd;
    } else if (ruler.okres) {
        const match = ruler.okres.match(/(\d+)\D+(\d+)/);
        if (match) form['ruler-period-from'].value = match[1];
    }
    if (ruler.okresDo) {
        form['ruler-period-to'].value = ruler.okresDo;
    } else if (ruler.okres) {
        const match = ruler.okres.match(/(\d+)\D+(\d+)/);
        if (match) form['ruler-period-to'].value = match[2];
    }
    form['ruler-description'].value = ruler.opis || '';
    form['ruler-herb'].value = ruler.herbRodu || '';
    form['ruler-map'].value = ruler.mapka || '';

    document.getElementById('rulerSubmitBtn').textContent = "Edytuj władcę";
    document.getElementById('addRulerModal').style.display = 'block';
}

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

            let rulersHtml = "";
            dynasty.władcy.forEach((ruler, i) => {
                rulersHtml += `
                    <div class="ruler-card" data-dynasty-index="${index}" data-ruler-index="${i}">
                        ${ruler.herbRodu ? `<img src="${ruler.herbRodu}" alt="Herb władcy" style="width: 80px;">` : ""}
                        <p><strong>${ruler.imie}</strong></p>
                        <p>${ruler.opis}</p>
                        ${ruler.mapka ? `<img src="${ruler.mapka}" alt="Mapa" style="width: 100px;">` : ""}
                        <div class="ruler-actions">
                            <button class="edit-ruler-btn" title="Edytuj">&#9998;</button>
                            <button class="delete-ruler-btn" title="Usuń">&#128465;</button>
                        </div>
                    </div>
                `;
                // Dodaj strzałkę po każdym władcy oprócz ostatniego
                if (i < dynasty.władcy.length - 1) {
                    rulersHtml += `
                        <div class="ruler-arrow-block">
                            <div class="ruler-period">${ruler.okres}</div>
                            <div class="ruler-arrow">
                                <span>➔</span>
                            </div>
                        </div>
                    `;
                }
                // Dodaj pasek po ostatnim władcy
                if (i === dynasty.władcy.length - 1) {
                    rulersHtml += `
                        <div class="ruler-bar-block">
                            <div class="ruler-bar-period">${ruler.okres}</div>
                            <div class="ruler-bar"></div>
                        </div>
                    `;
                }
            });

            // Dodaj kafelek dodawania władcy na końcu
            rulersHtml += `
                <div class="ruler-card add-ruler-tile" data-dynasty-index="${index}" style="display:flex;align-items:center;justify-content:center;cursor:pointer;">
                    <span style="font-size:48px;">+</span>
                </div>
            `;

            dynastyItem.innerHTML = `
                <div class="dynasty-grid">
                    <div class="dynasty-info">
                        <h3>${dynasty.nazwa}</h3>
                        <img src="${dynasty.herb}" alt="Herb ${dynasty.nazwa}" style="width: 100px;">
                        <p>${dynasty.motto}</p>
                        <button class="delete-dynasty-btn" onclick="deleteDynasty(${index})" title="Usuń dynastię">&#128465;</button>
                    </div>
                    <div class="rulers-list" data-dynasty-index="${index}">
                        ${rulersHtml}
                    </div>
                </div>
            `;

            dynastiesList.appendChild(dynastyItem);
        });

        // Obsługa kliknięcia w kafelek dodawania władcy
        document.querySelectorAll('.add-ruler-tile').forEach(tile => {
            tile.addEventListener('click', function() {
                const dynastyIndex = this.getAttribute('data-dynasty-index');
                openAddRulerModal(dynastyIndex);
            });
        });

        addRulerCardListeners();
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

    // Zamknięcie modala
    document.getElementById('closeRulerModal').onclick = function() {
        document.getElementById('addRulerModal').style.display = 'none';
    };

    // Dodanie władcy przez pop-up
    document.getElementById('add-ruler-popup-form').onsubmit = function(e) {
        e.preventDefault();
        const dynasties = getDynasties();

        const form = e.target;
        const from = parseInt(form['ruler-period-from'].value);
        const to = parseInt(form['ruler-period-to'].value);

        // Pobierz ostatniego władcę tej dynastii (do walidacji tylko przy dodawaniu)
        if (!editMode) {
            const rulers = dynasties[currentDynastyIndex].władcy;
            if (rulers.length > 0) {
                let lastTo = 0;
                const lastRuler = rulers[rulers.length - 1];
                if (lastRuler.okres) {
                    const match = lastRuler.okres.match(/(\d+)\D+(\d+)/);
                    if (match) lastTo = parseInt(match[2]);
                }
                if (lastRuler.okresDo) {
                    lastTo = parseInt(lastRuler.okresDo);
                }
                if (from <= lastTo) {
                    alert("Data rozpoczęcia rządów nowego władcy musi być późniejsza niż data końca poprzedniego władcy (" + lastTo + ").");
                    return;
                }
            }
        }
        if (from >= to) {
            alert("Data końca rządów musi być większa niż data rozpoczęcia.");
            return;
        }

        const newRuler = {
            imie: form['ruler-name'].value,
            okres: `${from}-${to}`,
            okresOd: from,
            okresDo: to,
            opis: form['ruler-description'].value,
            herbRodu: form['ruler-herb'].value || null,
            mapka: form['ruler-map'].value || null
        };

        if (editMode) {
            // Nadpisz istniejącego władcę
            dynasties[editDynastyIdx].władcy[editRulerIdx] = newRuler;
        } else {
            dynasties[currentDynastyIndex].władcy.push(newRuler);
        }
        saveDynasties(dynasties);
        form.reset();
        document.getElementById('addRulerModal').style.display = 'none';
        renderDynasties();
        editMode = false;
        editDynastyIdx = null;
        editRulerIdx = null;
    };

    // Zamknięcie modala po kliknięciu poza treść
    window.onclick = function(event) {
        const modal = document.getElementById('addRulerModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    renderDynasties();
    function addRulerCardListeners() {
        document.querySelectorAll('.delete-ruler-btn').forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const card = btn.closest('.ruler-card');
                const dynastyIdx = parseInt(card.getAttribute('data-dynasty-index'));
                const rulerIdx = parseInt(card.getAttribute('data-ruler-index'));
                if (confirm("Na pewno usunąć tego władcę?")) {
                    const dynasties = getDynasties();
                    dynasties[dynastyIdx].władcy.splice(rulerIdx, 1);
                    saveDynasties(dynasties);
                    renderDynasties();
                    addRulerCardListeners();
                }
            };
        });

        document.querySelectorAll('.edit-ruler-btn').forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const card = btn.closest('.ruler-card');
                const dynastyIdx = parseInt(card.getAttribute('data-dynasty-index'));
                const rulerIdx = parseInt(card.getAttribute('data-ruler-index'));
                // Otwórz modal edycji (możesz użyć tego samego co do dodawania, tylko wypełnij wartości)
                openEditRulerModal(dynastyIdx, rulerIdx);
            };
        });
    }

    addRulerCardListeners();

    // POKAŻ FORMULARZ PO KLIKNIĘCIU "STWÓRZ SWOJE AAR"
    const createAARBtn = document.getElementById("createAARBtn");
    const dynastyFormContainer = document.getElementById("dynastyFormContainer");
    if (createAARBtn && dynastyFormContainer) {
        createAARBtn.onclick = () => {
            dynastyFormContainer.style.display = "block";
            createAARBtn.style.display = "none";
        };
    }
});
