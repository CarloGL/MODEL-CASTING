document.addEventListener('DOMContentLoaded', function() {
    if (typeof createAdminHeader === 'function') {
        createAdminHeader();
    }
document.addEventListener('DOMContentLoaded', function() {
    const scanner = new Html5QrcodeScanner("scanner-container", { fps: 10, qrbox: 250 });
    let currentModelId = null;
    
    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText, decodedResult) {
        console.log(`Code scanned = ${decodedText}`, decodedResult);
        checkInModel(decodedText);
    }

    function onScanFailure(error) {
        console.warn(`Code scan error = ${error}`);
    }

    document.getElementById('check-in-button').addEventListener('click', function() {
        const modelId = document.getElementById('model-id').value;
        if (modelId) {
            checkInModel(modelId);
        }
    });

    document.getElementById('accept-model').addEventListener('click', function() {
        if (currentModelId) {
            updateModelStatus(currentModelId, 'accepted');
        }
    });

    document.getElementById('deny-model').addEventListener('click', function() {
        if (currentModelId) {
            updateModelStatus(currentModelId, 'denied');
        }
    });

    // Cerrar el popup
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('popup').style.display = 'none';
    });

    // Cerrar el popup si se hace clic fuera de él
    window.addEventListener('click', function(event) {
        if (event.target == document.getElementById('popup')) {
            document.getElementById('popup').style.display = 'none';
        }
    });

    async function checkInModel(modelId) {
        try {
            const response = await fetch(`/model/${modelId}`);
            const model = await response.json();

            if (response.ok) {
                displayModelDetails(model);
                currentModelId = model._id;
                document.getElementById('result').textContent = 'Model details retrieved successfully.';
            } else {
                document.getElementById('result').textContent = `Error: ${model.error}`;
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            document.getElementById('result').textContent = 'An error occurred during check-in.';
        }
    }

    function displayModelDetails(model) {
        const modelInfo = document.getElementById('model-info');
        modelInfo.innerHTML = `
            <p><strong>Name:</strong> ${model.fullName}</p>
            <p><strong>Participation Number:</strong> ${model.participationNumber}</p>
            <p><strong>Gender:</strong> ${model.gender}</p>
            <p><strong>Age:</strong> ${model.age}</p>
            <p><strong>Email:</strong> ${model.emailAddress}</p>
            <p><strong>Phone:</strong> ${model.phoneNumber}</p>
            <p><strong>Status:</strong> ${model.status}</p>
        `;
        document.getElementById('popup').style.display = 'block';
    }

    async function updateModelStatus(modelId, status) {
        try {
            const response = await fetch(`/models/${modelId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });
            const result = await response.json();

            if (response.ok) {
                document.getElementById('result').textContent = `Model status updated to: ${status}`;
                document.getElementById('popup').style.display = 'none';
                // Opcionalmente, podrías volver a cargar los detalles del modelo aquí
                // checkInModel(modelId);
            } else {
                document.getElementById('result').textContent = `Error: ${result.error}`;
            }
        } catch (error) {
            console.error('Error updating model status:', error);
            document.getElementById('result').textContent = 'An error occurred while updating model status.';
        }
    }
});
});