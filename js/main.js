// FUNKCJA DO POBIERANIA IKONEK

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
        const dynastiesToShow = dynasties.slice(start, end);

        previewsContainer.innerHTML = "";
        dynastiesToShow.forEach((dynasty, idx) => {
            const preview = document.createElement("div");
            preview.className = "previews";
            preview.onclick = () => openModal(dynasty);
            preview.innerHTML = `
                <h1>${dynasty.nazwa}</h1>
                <div class="previewImgs">
                    <img src="${dynasty.herb}" alt="Herb dynastii">
                </div>
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
        let rulersHtml = "";
        dynasty.władcy.forEach((ruler, i) => {
            rulersHtml += `
                <div class="ruler-card" style="margin: 10px auto;" >
                    ${ruler.herbRodu ? `<img src="${ruler.herbRodu}" alt="Herb władcy" style="width: 80px;">` : ""}
                    <p>
                        <span class="ruler-rank-icon" data-rank="${ruler.poziom || 'bezziemi'}">${getRankIcon(ruler.poziom || 'bezziemi')}</span>
                        <strong>${ruler.imie}</strong>
                    </p>
                    <p>${ruler.opis}</p>
                    <p><em>${ruler.okres}</em></p>
                    ${ruler.mapka ? `<img src="${ruler.mapka}" alt="Mapa" style="width: 100px;">` : ""}
                </div>
            `;
            if (i < dynasty.władcy.length - 1) {
                rulersHtml += `
                    <div class="ruler-arrow-block-side" style="display:flex;align-items:center;justify-content:center;margin:8px 0;">
                        <div class="ruler-arrow-side" style="font-size:72px;color:#fff;line-height:1;margin-right:8px;">
                            <span>↓</span>
                        </div>
                        <div class="ruler-period-side" style="font-size:14px;color:#fff;font-style:italic;">
                            ${ruler.okres}
                        </div>
                    </div>
                `;
            }
            if (i === dynasty.władcy.length - 1) {
                rulersHtml += `
                    <div class="ruler-bar-block" style="display:flex;flex-direction:column;align-items:center;min-width:80px;margin:0 10px;">
                        <div class="ruler-bar-period" style="font-size:14px;color:#fff;margin-bottom:2px;text-align:center;font-style:italic;">
                            ${ruler.okres}
                        </div>
                        <div class="ruler-bar" style="width:60px;height:6px;background:linear-gradient(90deg,#fff 60%,#8a1d2f 100%);border-radius:3px;margin-top:2px;"></div>
                    </div>
                `;
            }
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

    const dynasties = getDynasties();
    dynasties.forEach(dynasty => {
        dynasty.władcy.forEach(ruler => {
            if (!ruler.poziom) ruler.poziom = "bezziemi";
        });
    });
    localStorage.setItem("dynasties", JSON.stringify(dynasties));

    renderPreviews(currentPage);
});