document.addEventListener('DOMContentLoaded', async () => {
  async function getUsers() {
    try {
      const res = await fetch('http://localhost:8000/api/clientes');
      if (!res.ok) throw new Error('Error en la respuesta del servidor');
      return await res.json();
    } catch (error) {
      console.error('Error: ', error);
      return { body: [] };
    }
  }

  function renderUsers(users) {
    const container = document.getElementById('divContainer');
    container.innerHTML = '';

    if (!users.length) {
      container.innerHTML = `<p class="col-span-full text-center text-gray-400">No hay usuarios para mostrar</p>`;
      return;
    }

    users.forEach(u => {
      container.innerHTML += `
        <div class="bg-gray-800 border border-gray-700 rounded-2xl p-4 shadow-lg hover:scale-[1.02] transition-transform">
          <h3 class="text-lg font-semibold text-yellow-400 mb-2">${u.nombre}</h3>
          <p><span class="font-medium">Edad:</span> ${u.edad ?? 'N/A'}</p>
          <p><span class="font-medium">Profesión:</span> ${u.profesion ?? 'N/A'}</p>
        </div>
      `;
    });
  }

  const data = await getUsers();
  renderUsers(data.body);
});
