const farmerForm = document.getElementById('farmerForm');
const farmersList = document.getElementById('farmers');
const searchInput = document.getElementById('searchInput');

let farmersData = [];
let map = L.map('map').setView([20,77],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let markers = [];

// Fetch farmers
function fetchFarmers(query=''){
    let url = 'http://localhost:5000/farmers';
    if(query) url = `http://localhost:5000/search?q=${query}`;
    fetch(url)
        .then(res=>res.json())
        .then(data=>{
            farmersData = data;
            renderFarmers();
            renderMap();
        });
}

// Render list
function renderFarmers(){
    farmersList.innerHTML='';
    farmersData.forEach(f=>{
        const li = document.createElement('li');
        li.innerHTML = `<strong>${f.name}</strong> | Email: ${f.email} | Rating: ${f.rating||0}`;
        farmersList.appendChild(li);
    });
}

// Render map
function renderMap(){
    markers.forEach(m=>map.removeLayer(m));
    markers = [];
    farmersData.forEach(f=>{
        const marker = L.marker([f.location[0],f.location[1]]).addTo(map)
            .bindPopup(`<strong>${f.name}</strong>`);
        markers.push(marker);
    });
}

// Add farmer
farmerForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const newFarmer={
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        location: [parseFloat(document.getElementById('lat').value), parseFloat(document.getElementById('lng').value)],
        rating:0
    };
    fetch('http://localhost:5000/farmers',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(newFarmer)
    }).then(res=>res.json())
      .then(data=>{
        farmerForm.reset();
        fetchFarmers();
    });
});

// Search
searchInput.addEventListener('input',(e)=>{
    const q = e.target.value;
    fetchFarmers(q);
});

// Initial fetch
fetchFarmers();
