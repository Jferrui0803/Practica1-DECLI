const Cliente = {
    send: ()=>{
        fetch('http://localhost:3000/api/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: 'Nuevo Ítem'
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('Ítem creado:', data);
            })
            .catch(error => {
              console.error('Error al crear el ítem:', error);
            });
          
    }
}

Cliente.send();

class DragAndDrop {
  constructor() {
      this.cards = document.querySelectorAll('.card');
      this.dropZones = document.querySelectorAll('.drop-zone');
      this.initDragAndDrop();
  }

  initDragAndDrop() {
      this.cards.forEach(card => {
          card.addEventListener('dragstart', this.onDragStart);
      });

      this.dropZones.forEach(zone => {
          zone.addEventListener('dragover', this.onDragOver);
          zone.addEventListener('drop', this.onDrop);
      });
  }


  onDragStart(event) {
      event.dataTransfer.setData('text/plain', event.target.dataset.suit);
      event.dataTransfer.setData('id', event.target.textContent);
  }

  onDragOver(event) {
      event.preventDefault();
  }

  onDrop(event) {
    event.preventDefault();
    const suit = event.target.dataset.suit;
    const draggedSuit = event.dataTransfer.getData('text/plain');
    const cardId = event.dataTransfer.getData('id');
    if (suit === draggedSuit) {
        const draggedElement = Array.from(document.querySelectorAll('.card'))
            .find(card => card.textContent.trim() === cardId);
        if (draggedElement) {
            event.target.appendChild(draggedElement);
            saveState(); // Guardar el estado después de mover una carta
        } else {
            console.error('No se encontró la carta arrastrada.');
        }
    } else {
        alert('La carta no corresponde a este palo.');
    }
}

}

new DragAndDrop();

// Fetch para recuperar estado inicial
fetch('http://localhost:3000/api/items')
  .then(response => response.json())
  .then(data => {
      console.log('Estado recuperado:', data);
  })
  .catch(error => console.error('Error al recuperar el estado:', error));

// Función para guardar el estado actual (Ejemplo)
function saveState() {
  const state = [];
  document.querySelectorAll('.drop-zone').forEach(zone => {
      const suit = zone.dataset.suit;
      const cards = Array.from(zone.children).map(card => ({
          id: card.textContent,
          suit
      }));
      state.push(...cards);
  });

  fetch('http://localhost:3000/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
  })
      .then(response => response.json())
      .then(data => console.log('Estado guardado:', data))
      .catch(error => console.error('Error al guardar el estado:', error));
}

function loadState() {
  fetch('http://localhost:3000/api/items')
      .then(response => response.json())
      .then(data => {
          data.forEach(item => {
              const zone = document.querySelector(`.drop-zone[data-suit="${item.suit}"]`);
              const card = Array.from(document.querySelectorAll('.card'))
                  .find(c => c.textContent.trim() === item.id);
              if (zone && card) {
                  zone.appendChild(card);
              }
          });
      })
      .catch(error => console.error('Error al cargar el estado:', error));
}

loadState();


