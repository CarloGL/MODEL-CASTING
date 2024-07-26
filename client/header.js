// header.js
function createAdminHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <nav>
            <ul>
                <li><a href="index.html">Inicio</a></li>
                <li><a href="admin.html">Panel de Administración</a></li>
                <li><a href="admin-checkin.html">Check-in (Escáner QR)</a></li>
            </ul>
        </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);
}

// Llamar a esta función solo en las páginas de administración
if (window.location.pathname.includes('admin')) {
    createAdminHeader();
}