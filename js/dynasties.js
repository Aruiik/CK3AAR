// FORMULARZ DO DODAWANIA I EDYCJI DYNASTII ORAZ WŁADCÓW

let currentDynastyIndex = null;
let editMode = false;
let editDynastyIdx = null;
let editRulerIdx = null;

function openAddRulerModal(dynastyIndex) {
    currentDynastyIndex = dynastyIndex;
    editMode = false;
    const dynasties = JSON.parse(localStorage.getItem("dynasties")) || [];
    const rulers = dynasties[dynastyIndex]?.władcy || [];
    let minYear = '';
    if (rulers.length > 0) {
        const lastRuler = rulers[rulers.length - 1];
        let lastTo = 0;
        if (lastRuler.okres) {
            const match = lastRuler.okres.match(/(\d+)\D+(\d+)/);
            if (match) lastTo = parseInt(match[2]);
        }
        if (lastRuler.okresDo) {
            lastTo = parseInt(lastRuler.okresDo);
        }
        minYear = lastTo;
    }
    const fromInput = document.querySelector('#add-ruler-popup-form [name="ruler-period-from"]');
    if (fromInput) {
        fromInput.min = minYear ? (minYear + 1) : '';
        fromInput.value = minYear ? (minYear + 1) : '';
    }
    document.getElementById('addRulerModal').style.display = 'block';
}

function openEditRulerModal(dynastyIdx, rulerIdx) {
    editMode = true;
    editDynastyIdx = dynastyIdx;
    editRulerIdx = rulerIdx;

    const dynasties = JSON.parse(localStorage.getItem("dynasties")) || [];
    const ruler = dynasties[dynastyIdx].władcy[rulerIdx];

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
    form['ruler-rank'].value = ruler.poziom || "bezziemi";

    document.getElementById('addRulerModal').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    const dynastiesList = document.getElementById("dynasties-list");
    const dynastyModal = document.getElementById("dynastyModal");
    const dynastyModalTitle = document.getElementById("dynastyModalTitle");
    const dynastyForm = document.getElementById("dynasty-form");
    const dynastyModalBtn = document.getElementById("dynastyModalBtn");
    const closeDynastyModal = document.getElementById("closeDynastyModal");
    const createAARBtn = document.getElementById("createAARBtn");

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
            dynastyItem.style.animationDelay = (index * 0.08) + "s";

            let rulersHtml = "";
            dynasty.władcy.forEach((ruler, i) => {
                rulersHtml += `
                    <div class="ruler-card" data-dynasty-index="${index}" data-ruler-index="${i}" style="animation-delay:${i * 0.06}s">
                        ${ruler.herbRodu ? `<img src="${ruler.herbRodu}" alt="Herb władcy" style="width: 80px;">` : ""}
                        <p>
                          <span class="ruler-rank-icon" data-rank="${ruler.poziom}">${getRankIcon(ruler.poziom)}</span>
                          <strong>${ruler.imie}</strong>
                        </p>
                        <p>${ruler.opis}</p>
                        ${ruler.mapka ? `<img src="${ruler.mapka}" alt="Mapa" style="width: 100px;">` : ""}
                        <div class="ruler-actions">
                            <button class="edit-ruler-btn" title="Edytuj">&#9998;</button>
                            <button class="delete-ruler-btn" title="Usuń">&#128465;</button>
                        </div>
                    </div>
                `;
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
                if (i === dynasty.władcy.length - 1) {
                    rulersHtml += `
                        <div class="ruler-bar-block">
                            <div class="ruler-bar-period">${ruler.okres}</div>
                            <div class="ruler-bar"></div>
                        </div>
                    `;
                }
            });

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
                        <button class="edit-dynasty-btn" data-dynasty-index="${index}" title="Edytuj dynastię">&#9998;</button>
                        <button class="delete-dynasty-btn" onclick="deleteDynasty(${index})" title="Usuń dynastię">&#128465;</button>
                    </div>
                    <div class="rulers-list" data-dynasty-index="${index}">
                        ${rulersHtml}
                    </div>
                </div>
            `;

            dynastiesList.appendChild(dynastyItem);
        });

        document.querySelectorAll('.add-ruler-tile').forEach(tile => {
            tile.addEventListener('click', function() {
                const dynastyIndex = this.getAttribute('data-dynasty-index');
                openAddRulerModal(dynastyIndex);
            });
        });

        addRulerCardListeners();
    }

    if (dynastyForm) {
        dynastyForm.onsubmit = function(event) {
            event.preventDefault();

            const file = dynastyCoatOfArmsInput.files[0];
            const dynasties = getDynasties();

            if (typeof window.editDynastyIdx === "number") {
                // EDYCJA
                const idx = window.editDynastyIdx;
                dynasties[idx].nazwa = dynastyNameInput.value;
                dynasties[idx].motto = dynastyMottoInput.value;
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        dynasties[idx].herb = e.target.result;
                        saveDynasties(dynasties);
                        dynastyForm.reset();
                        dynastyModal.style.display = "none";
                        renderDynasties();
                    };
                    reader.readAsDataURL(file);
                    return;
                } else {
                    saveDynasties(dynasties);
                    dynastyForm.reset();
                    dynastyModal.style.display = "none";
                    renderDynasties();
                    return;
                }
            }

            // DODAWANIE
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
                dynasties.push(newDynasty);
                saveDynasties(dynasties);
                dynastyForm.reset();
                dynastyModal.style.display = "none";
                renderDynasties();
            };
            reader.readAsDataURL(file);
        };
    }

    window.deleteDynasty = (index) => {
        let dynasties = getDynasties();
        dynasties.splice(index, 1);
        saveDynasties(dynasties);
        renderDynasties();
    };

    document.getElementById('closeRulerModal').onclick = function() {
        document.getElementById('addRulerModal').style.display = 'none';
    };

    document.getElementById('add-ruler-popup-form').onsubmit = function(e) {
        e.preventDefault();
        const dynasties = getDynasties();

        const form = e.target;
        const from = parseInt(form['ruler-period-from'].value);
        const to = parseInt(form['ruler-period-to'].value);

        const rulers = editMode
            ? dynasties[editDynastyIdx].władcy
            : dynasties[currentDynastyIndex].władcy;

        if (from >= to) {
            alert("Data końca rządów musi być większa niż data rozpoczęcia.");
            return;
        }

        // WALIDACJA DLA EDYCJI I DODAWANIA
        if (editMode) {
            if (editRulerIdx > 0) {
                const prev = rulers[editRulerIdx - 1];
                let prevTo = prev.okresDo || (prev.okres ? parseInt(prev.okres.split('-')[1]) : null);
                if (prevTo !== null && from <= prevTo) {
                    alert("Data rozpoczęcia rządów musi być późniejsza niż data końca poprzedniego władcy (" + prevTo + ").");
                    return;
                }
            }
            if (editRulerIdx < rulers.length - 1) {
                const next = rulers[editRulerIdx + 1];
                let nextFrom = next.okresOd || (next.okres ? parseInt(next.okres.split('-')[0]) : null);
                if (nextFrom !== null && to >= nextFrom) {
                    alert("Data końca rządów musi być wcześniejsza niż data rozpoczęcia kolejnego władcy (" + nextFrom + ").");
                    return;
                }
            }
        } else {
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

        const newRuler = {
            imie: form['ruler-name'].value,
            okres: `${from}-${to}`,
            okresOd: from,
            okresDo: to,
            opis: form['ruler-description'].value,
            herbRodu: form['ruler-herb'].value || null,
            mapka: form['ruler-map'].value || null,
            poziom: form['ruler-rank'].value       
        };

        if (editMode) {
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

    window.onclick = function(event) {
        const rulerModal = document.getElementById('addRulerModal');
        if (event.target === rulerModal) {
            rulerModal.style.display = 'none';
        }
        if (event.target === dynastyModal) {
            dynastyModal.style.display = 'none';
        }
    };

    // Obsługa przycisku "Stwórz swoje AAR"
    if (createAARBtn && dynastyModal) {
        createAARBtn.onclick = () => {
            dynastyModalTitle.textContent = "Dodaj dynastię";
            dynastyForm.reset();
            dynastyModal.style.display = "block";
            window.editDynastyIdx = undefined;
        };
    }
    if (closeDynastyModal) {
        closeDynastyModal.onclick = () => {
            dynastyModal.style.display = "none";
        };
    }

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
                openEditRulerModal(dynastyIdx, rulerIdx);
            };
        });

        document.querySelectorAll('.edit-dynasty-btn').forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const dynastyIdx = parseInt(btn.getAttribute('data-dynasty-index'));
                const dynasties = getDynasties();
                const dynasty = dynasties[dynastyIdx];
                if (!dynasty) return;

                dynastyModalTitle.textContent = "Edytuj dynastię";
                dynastyNameInput.value = dynasty.nazwa;
                dynastyMottoInput.value = dynasty.motto;
                dynastyModal.style.display = "block";
                window.editDynastyIdx = dynastyIdx;
            };
        });
    }

    renderDynasties();
});

function getRankIcon(rank) {
    switch(rank) {
        case "bezziemi": return "🧑";
        case "hrabia": return "🏰";
        case "diuk": return "🎩";
        case "krol": return "⚜️";
        case "cesarz": return "👑";
        default: return "";
    }
}
