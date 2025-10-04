document.addEventListener('DOMContentLoaded', async() => {

    async function getUsers() {
        try {
            const res = await fetch('http://localhost:8000/api/clientes');
            return await res.json();
        } catch (error) {
            console.log('Error: ', error);
            
        }
    };

    let data = await getUsers();
    console.log(data);
    
    function renderUsers(users) {
        const container = document.getElementById('divContainer');
        console.log(container.textContent);

        container.textContent = ''
        
        users.forEach(u => {
            container.innerHTML += `<div class="border-1 border-green-300 w-60 pl-10">
                <h2>Nombre: ${u.name}</h2>
                <p>Edad: ${u.years}</p>
                <p>phone: ${u.phone}</p>
                <ul>
                    <li>Ciudad: ${u.address.city}</li>
                    <li>Street: ${u.address.street}</li>
                    <li>Ubi: ${u.address.ubi}</li>
                </ul>
            </div>`;
        });
    }


    renderUsers(data.body);
});