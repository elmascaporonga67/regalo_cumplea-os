const API_URL = 'http://localhost:5000/api/mensajes';

// 1. Reproductor de Música
const btnMusica = document.getElementById('btn-musica');
const bgMusic = document.getElementById('bg-music');

btnMusica.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    btnMusica.textContent = '⏸️ Pausar Música';
  } else {
    bgMusic.pause();
    btnMusica.textContent = '🎵 Reproducir Música';
  }
});

// 2. Cargar mensajes desde MongoDB (GET)
async function cargarMensajes() {
  const contenedor = document.getElementById('contenedor-mensajes');
  
  try {
    const respuesta = await fetch(API_URL);
    const mensajes = await respuesta.json();

    if (mensajes.length === 0) {
      contenedor.innerHTML = '<p>Sé el primero en dejar un mensaje especial ❤️</p>';
      return;
    }

    contenedor.innerHTML = mensajes.map(m => `
      <div class="tarjeta-mensaje">
        <h4>${m.nombre}</h4>
        <p>${m.mensaje}</p>
        <small>${new Date(m.fecha).toLocaleDateString()}</small>
      </div>
    `).join('');
  } catch (error) {
    contenedor.innerHTML = '<p>Error al conectar con la base de datos.</p>';
  }
}

// 3. Guardar un nuevo mensaje en MongoDB (POST)
const formMensaje = document.getElementById('form-mensaje');

formMensaje.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const mensaje = document.getElementById('mensaje').value;

  try {
    const respuesta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, mensaje })
    });

    if (respuesta.ok) {
      formMensaje.reset();
      cargarMensajes(); // Recargar la lista de mensajes
    }
  } catch (error) {
    alert('No se pudo enviar el mensaje. Asegúrate de que el servidor esté encendido.');
  }
});

// Cargar mensajes al abrir la página
cargarMensajes();