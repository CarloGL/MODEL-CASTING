document.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch('/models');
    const models = await response.json();

    const modelsList = document.getElementById('modelsList');
    models.forEach(model => {
        const modelDiv = document.createElement('div');
        modelDiv.className = 'model';

        const name = document.createElement('h2');
        name.textContent = model.fullName;

        const img = document.createElement('img');
        img.src = `/uploads/${model.profilePicture}`;
        img.alt = model.fullName;
        img.className = 'profile-image';

        const qrAndNumberContainer = document.createElement('div');
        qrAndNumberContainer.className = 'qr-and-number-container';

        const qrContainer = document.createElement('div');
        qrContainer.className = 'qr-container';
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`http://localhost:5000/detailsmodels.html?id=${model._id}`)}&size=150x150&color=255-255-255&bgcolor=0-0-0`;
        const qrImg = document.createElement('img');
        qrImg.src = qrUrl;   
        qrImg.alt = 'QR Code';
        qrContainer.appendChild(qrImg);

        const participationNumber = document.createElement('div');
        participationNumber.className = 'participation-number';
        participationNumber.textContent = model.participationNumber || 'N/A';

        qrAndNumberContainer.appendChild(qrContainer);
        qrAndNumberContainer.appendChild(participationNumber);

        const infoGrid = document.createElement('div');
        infoGrid.className = 'info-grid';

        const row1 = document.createElement('div');
        row1.className = 'info-row';
        row1.innerHTML = `
            <span>Gender: ${model.gender}</span>
            <span>Age: ${model.age}</span>
        `;

        const row2 = document.createElement('div');
        row2.className = 'info-row';
        row2.innerHTML = `
            <span>TikTok: ${model.tiktokUsername}</span>
            <span>Instagram: ${model.instagramUsername}</span>
        `;

        const row3 = document.createElement('div');
        row3.className = 'info-row';
        row3.innerHTML = `
            <span>Phone: ${model.phoneNumber}</span>
        `;

        infoGrid.appendChild(row1);
        infoGrid.appendChild(row2);
        infoGrid.appendChild(row3);
        modelDiv.appendChild(name);
        modelDiv.appendChild(img);
        modelDiv.appendChild(qrAndNumberContainer);
        modelDiv.appendChild(infoGrid);
        
        modelsList.appendChild(modelDiv);
    });
});