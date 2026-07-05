document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const wrapper = document.getElementById('wrapper');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            wrapper.classList.toggle('toggled');
        });
    }

    // Auto close alert
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.classList.add('fade');
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
});

function confirmDelete(message) {
    return confirm(message || 'Apakah Anda yakin?');
}