// OBSŁUGA WCZYTYWANIA STYLÓW PREVIEWS (TARCZ DYNASTII NA GŁÓWNEJ STRONIE, ŻEBY SIĘ POJAWIAŁY TAK Z OPÓŹNIENIEM, JAKBY SIĘ ODSŁANIAŁO COŚ)

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


// OBSŁUGA WYSUWANYCH OPCJI (ŻEBY POKAZYWAŁO AKTUALNEGO HREFA NA KTÓRYM SIĘ JEST)

document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".dropdown-content a");
    const button = document.getElementById("dropdownButton");
    const menu = document.getElementById("dropdownMenu");
    const arrow = button.querySelector(".arrow");

    // ZAMIANA NAPISU "OPCJE" NA AKTUALNĄ STRONĘ NA KTÓREJ JEST UŻYTKOWNIK
    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            const labelSpan = button.querySelector(".btn-label");
            if (labelSpan) {
                labelSpan.textContent = link.textContent;
            }
        }
    });

    // DOPASOWANIE SZEROKOŚCI MENU DO PRZYCISKU
    const setMenuWidth = () => {
        const buttonWidth = button.offsetWidth;
        menu.style.width = buttonWidth + "px";
    };

    setMenuWidth();

    // ROZWIJANIE/ZAMYKANIE MENU
    button.addEventListener("click", function (e) {
        e.stopPropagation(); // ŻEBY ODRAZU NIE ZAMYKAŁ
        menu.classList.toggle("show");
        arrow.classList.toggle("rotate");
    });

    menu.addEventListener("click", function(e) {
    e.stopPropagation(); // ZABEZPIECZENIE ŻEBY KLIKANIE PO MENU NIE ANULOWAŁO ROZWIJANIA MENU
    });

    // A TU ŻEBY KLIKNIĘCIE POZA MENU ZWIJAŁO JE
    document.addEventListener("click", function () {
        menu.classList.remove("show");
        arrow.classList.remove("rotate");
    });
});


