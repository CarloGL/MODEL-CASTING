document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${result.error || result.message || 'Unknown error'}`);
        }

        alert(result.message || 'Registration successful');
    } catch (error) {
        console.error('Error detallado:', error);
        alert('Error during registration: ' + error.message);
    }
  });

  document.getElementById('profilePic').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('profilePicPreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
  });

  // Función para verificar que todos los campos requeridos estén llenos
  function validateForm() {
    const form = document.getElementById('registerForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
  }

  // Agregar validación antes de enviar el formulario
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    if (!validateForm()) {
        e.preventDefault();
        alert('Please fill in all required fields.');
    }
  });