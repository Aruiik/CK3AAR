// DODAWANIE DYNASTII ZA POMOCĄ PRZYCISKU "createAARBtn"

document.addEventListener("DOMContentLoaded", () => {
    const createAARBtn = document.getElementById("createAARBtn");
    const dynastyFormContainer = document.getElementById("dynastyFormContainer");

    if (createAARBtn) {
        createAARBtn.addEventListener("click", () => {
            dynastyFormContainer.style.display = "block";
        });
    }
});


// OBSŁUGA POP-UP'U

const dynastyData = {
  dynastia1: {
    shield: '🛡️ Dynastia 1', // tutaj możesz wrzucić obrazek lub styl tarczy
    rulers: ['Władca A', 'Władca B', 'Władca C']
  },
  dynastia2: {
    shield: '🛡️ Dynastia 2',
    rulers: ['Król X', 'Król Y']
  }
};

function openModal(dynastyId) {
  const modal = document.getElementById('dynastyModal');
  const shield = document.getElementById('modalShield');
  const rulers = document.getElementById('modalRulers');

  const data = dynastyData[dynastyId];

  shield.innerHTML = `<h2>${data.shield}</h2>`;
  rulers.innerHTML = data.rulers.join(' → ');

  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('dynastyModal');
  modal.style.display = 'none';
}

