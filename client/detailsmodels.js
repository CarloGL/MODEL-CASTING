document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const modelId = urlParams.get('id');

    if (modelId) {
        try {
            const response = await fetch(`/model/${modelId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const model = await response.json();

            displayModelDetails(model);
        } catch (error) {
            console.error('Error:', error);
            const detailsDiv = document.getElementById('modelDetails');
            detailsDiv.textContent = 'Error loading model details. Please try again later.';
        }
    } else {
        console.error('No model ID provided');
        const detailsDiv = document.getElementById('modelDetails');
        detailsDiv.textContent = 'No model ID provided. Unable to load details.';
    }
});

function displayModelDetails(model) {
    const detailsDiv = document.getElementById('modelDetails');
    detailsDiv.className = 'model-details-container';

    // Contenedor de la imagen
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    const img = document.createElement('img');
    img.src = `/uploads/${model.profilePicture}`;
    img.alt = model.fullName;
    imageContainer.appendChild(img);

    // Contenedor de los datos
    const dataContainer = document.createElement('div');
    dataContainer.className = 'data-container';

    // Número de participación
    const participationNumber = document.createElement('div');
    participationNumber.className = 'participation-number';
    participationNumber.textContent = `Participation Number: ${model.participationNumber || 'N/A'}`;

    // Nombre
    const name = document.createElement('h2');
    name.textContent = model.fullName;

    dataContainer.appendChild(participationNumber);
    dataContainer.appendChild(name);

    // Resto de los datos
    const dataElements = [
        { label: 'Gender', value: model.gender },
        { label: 'Age', value: model.age },
        { label: 'Email', value: model.emailAddress },
        { label: 'Phone', value: model.phoneNumber },
        { label: 'Availability', value: model.availability },
        { label: 'Bio', value: model.bio },
        { label: 'Experience', value: model.experience },
        { label: 'Portfolio', value: model.portfolioLink, isLink: true },
        { label: 'Walk Video', value: model.walkVideoLink, isLink: true },
        { label: 'Measurements', value: `Height - ${model.measurements.height} cm, Weight - ${model.measurements.weight} kg, Waist - ${model.measurements.waist} cm, Hips - ${model.measurements.hips} cm` },
        { label: 'TikTok', value: model.tiktokUsername },
        { label: 'Instagram', value: model.instagramUsername },
        { label: 'Status', value: model.status || 'Pending' }
    ];

    dataElements.forEach(el => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${el.label}:</strong> ${el.isLink ? `<a href="${el.value}" target="_blank">${el.value}</a>` : el.value}`;
        dataContainer.appendChild(p);
    });

    // Añadir botones de estatus
    const statusButtons = createStatusButtons(model._id, model.status);
    dataContainer.appendChild(statusButtons);

    detailsDiv.appendChild(imageContainer);
    detailsDiv.appendChild(dataContainer);
}

function createStatusButtons(modelId, currentStatus) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'status-button-container';

    const acceptButton = document.createElement('button');
    acceptButton.textContent = 'Aceptar';
    acceptButton.className = 'accept-button';
    acceptButton.disabled = currentStatus === 'accepted';
    acceptButton.addEventListener('click', () => updateModelStatus(modelId, 'accepted'));

    const denyButton = document.createElement('button');
    denyButton.textContent = 'Denegar';
    denyButton.className = 'deny-button';
    denyButton.disabled = currentStatus === 'denied';
    denyButton.addEventListener('click', () => updateModelStatus(modelId, 'denied'));

    buttonContainer.appendChild(acceptButton);
    buttonContainer.appendChild(denyButton);

    return buttonContainer;
}

async function updateModelStatus(modelId, status) {
    try {
        const response = await fetch(`/models/${modelId}/status`, {  // Cambiado de 'model' a 'models'
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert(`Model status updated to: ${status}`);
        // Recargar la página para mostrar el estado actualizado
        location.reload();
    } catch (error) {
        console.error('Error updating model status:', error);
        alert('Error updating model status. Please try again.');
    }
}