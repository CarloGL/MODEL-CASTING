let allModels = [];

async function fetchModels() {
    const response = await fetch('/models');
    allModels = await response.json();
    renderModelsTable(allModels);
}

function renderModelsTable(models) {
    const tableBody = document.getElementById('modelsTableBody');
    tableBody.innerHTML = '';

    models.forEach(model => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${model.participationNumber}</td>
            <td>${model.fullName}</td>
            <td>${model.gender}</td>
            <td>${model.age}</td>
            <td>${model.emailAddress}</td>
            <td>${model.tiktokUsername}</td>
            <td>${model.instagramUsername}</td>
            <td>${model.status}</td>
            <td>
                <button onclick="showDetails('${model._id}')">Details</button>
                <button onclick="deleteModel('${model._id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value.toLowerCase();
    const genderFilter = document.getElementById('genderFilter').value.toLowerCase();
    const ageFilter = document.getElementById('ageFilter').value;
    const participationNumberFilter = document.getElementById('participationNumberFilter').value.toLowerCase();
    const fullNameFilter = document.getElementById('fullNameFilter').value.toLowerCase();

    const filteredModels = allModels.filter(model => 
        (statusFilter === '' || model.status.toLowerCase().includes(statusFilter)) &&
        (genderFilter === '' || model.gender.toLowerCase().includes(genderFilter)) &&
        (ageFilter === '' || model.age == ageFilter) &&
        (participationNumberFilter === '' || model.participationNumber.toLowerCase().includes(participationNumberFilter)) &&
        (fullNameFilter === '' || model.fullName.toLowerCase().includes(fullNameFilter))
    );

    renderModelsTable(filteredModels);
}



async function showDetails(modelId) {
    const response = await fetch(`/model/${modelId}`);
    const model = await response.json();
    
    const popupContent = document.getElementById('popupContent');
    popupContent.innerHTML = `
        <h2>Details for ${model.fullName}</h2>
        <p><strong>Participation Number:</strong> ${model.participationNumber}</p>
        <p><strong>Gender:</strong> ${model.gender}</p>
        <p><strong>Age:</strong> ${model.age}</p>
        <p><strong>Email:</strong> ${model.emailAddress}</p>
        <p><strong>Phone:</strong> ${model.phoneNumber}</p>
        <p><strong>Availability:</strong> ${model.availability}</p>
        <p><strong>Bio:</strong> ${model.bio}</p>
        <p><strong>Experience:</strong> ${model.experience}</p>
        <p><strong>Portfolio:</strong> <a href="${model.portfolioLink}" target="_blank">${model.portfolioLink}</a></p>
        <p><strong>Walk Video:</strong> <a href="${model.walkVideoLink}" target="_blank">${model.walkVideoLink}</a></p>
        <p><strong>Height:</strong> ${model.measurements.height} cm</p>
        <p><strong>Weight:</strong> ${model.measurements.weight} kg</p>
        <p><strong>Waist:</strong> ${model.measurements.waist} cm</p>
        <p><strong>Hips:</strong> ${model.measurements.hips} cm</p>
        <p><strong>TikTok:</strong> ${model.tiktokUsername}</p>
        <p><strong>Instagram:</strong> ${model.instagramUsername}</p>
        <p><strong>Status:</strong> ${model.status}</p>
    `;
    
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
}

function closePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

async function editModel(modelId) {
    // Implementar lógica para editar modelo
    console.log('Edit model', modelId);
}

async function deleteModel(modelId) {
    console.log(`Attempting to delete model with id: ${modelId}`);
    if (confirm('Are you sure you want to delete this model?')) {
        try {
            const response = await fetch(`/models/${modelId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchModels(); // Refresh the table
            } else {
                throw new Error('Failed to delete model');
            }
        } catch (error) {
            console.error('Error deleting model:', error);
            alert('Failed to delete model. Please try again.');
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {

// Fetch models when the page loads
fetchModels();

// Cerrar el popup cuando se hace clic en la X
document.querySelector('.close').addEventListener('click', closePopup);

// Cerrar el popup cuando se hace clic fuera de él
window.addEventListener('click', function(event) {
    const popup = document.getElementById('popup');
    if (event.target == popup) {
        closePopup();
    }
});

// Si tienes un botón para aplicar filtros, añade su listener aquí

});