// OBSŁUGA POP-UP'U I WYŚWIETLANIA DYNASTII NA STRONIE GŁÓWNEJ

document.addEventListener("DOMContentLoaded", () => {
    const previewsContainer = document.getElementById("dynastyPreviews");
    const paginationContainer = document.getElementById("pagination");
    if (!previewsContainer) return;

    const DYNASTIES_PER_PAGE = 15;
    let currentPage = 1;

    function getDynasties() {
        return JSON.parse(localStorage.getItem("dynasties")) || [];
    }

    function renderPreviews(page = 1) {
        const dynasties = getDynasties();
        const totalPages = Math.ceil(dynasties.length / DYNASTIES_PER_PAGE);
        const start = (page - 1) * DYNASTIES_PER_PAGE;
        const end = start + DYNASTIES_PER_PAGE;
        // Wyświetlaj najnowsze dynastie jako pierwsze
        const dynastiesToShow = dynasties.slice().reverse().slice(start, end);

        previewsContainer.innerHTML = "";
        dynastiesToShow.forEach((dynasty, idx) => {
            const preview = document.createElement("div");
            preview.className = "previews";
            preview.onclick = () => openModal(dynasty);
            preview.innerHTML = `
                <h1>${dynasty.nazwa}</h1>
                <img class="previewImgs" src="${dynasty.herb}" alt="Herb dynastii">
                <p>${dynasty.motto || ""}</p>
            `;
            previewsContainer.appendChild(preview);
        });

        // PAGINACJA
        paginationContainer.innerHTML = "";
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement("button");
                btn.textContent = `[${i}]`;
                btn.className = (i === page) ? "pagination-btn active" : "pagination-btn";
                btn.onclick = () => {
                    currentPage = i;
                    renderPreviews(i);
                };
                paginationContainer.appendChild(btn);
            }
        }
    }

    // MODAL
    window.openModal = function(dynasty) {
        let modal = document.getElementById('dynastyModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'dynastyModal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close" id="closeModalBtn">&times;</span>
                    <div id="modalShield"></div>
                    <div id="modalRulers"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        document.getElementById('modalShield').innerHTML = `
            <h2>${dynasty.nazwa}</h2>
            <img class="modal-shield-img" src="${dynasty.herb}" alt="Herb dynastii">
            <p>${dynasty.motto || ""}</p>
        `;
        // Władcy w stylu z creator.html
        let rulersHtml = "";
        dynasty.władcy.forEach(ruler => {
            rulersHtml += `
                <div class="ruler-card" style="margin: 10px auto;">
                    ${ruler.herbRodu ? `<img src="${ruler.herbRodu}" alt="Herb władcy" style="width: 80px;">` : ""}
                    <p><strong>${ruler.imie}</strong></p>
                    <p>${ruler.opis}</p>
                    <p><em>${ruler.okres}</em></p>
                    ${ruler.mapka ? `<img src="${ruler.mapka}" alt="Mapa" style="width: 100px;">` : ""}
                </div>
            `;
        });
        document.getElementById('modalRulers').innerHTML = rulersHtml || "<p>Brak władców</p>";

        modal.style.display = 'block';
        document.getElementById('closeModalBtn').onclick = function() {
            modal.style.display = 'none';
        };
        window.onclick = function(event) {
            if (event.target === modal) modal.style.display = 'none';
        };
    };

    renderPreviews(currentPage);
});