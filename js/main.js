// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos del DOM
    const formElement = document.getElementById('employeeForm');
    const tableBody = document.querySelector('#employeeTable tbody');
    const dniInput = document.getElementById('dni');
    const apellidoPaternoInput = document.getElementById('apellidoPaterno');
    const apellidoMaternoInput = document.getElementById('apellidoMaterno');
    const sexoSelect = document.getElementById('sexo');

    // Array para almacenar los empleados
    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    // Inicializar la tabla con datos existentes
    updateTable();

    // Función para validar el DNI
    function validateDNI(dni) {
        return /^[0-9]{8}$/.test(dni);
    }

    // Función para validar nombres
    function validateName(name) {
        return /^[A-Za-zÑñÁáÉéÍíÓóÚú\s]+$/.test(name.trim());
    }

    // Función para limpiar el formulario
    function clearForm() {
        dniInput.value = '';
        apellidoPaternoInput.value = '';
        apellidoMaternoInput.value = '';
        sexoSelect.value = '';
    }

    // Función para agregar un empleado
    function handleSubmit(event) {
        event.preventDefault();

        // Obtener valores del formulario
        const dni = dniInput.value.trim();
        const apellidoPaterno = apellidoPaternoInput.value.trim();
        const apellidoMaterno = apellidoMaternoInput.value.trim();
        const sexo = sexoSelect.value;

        // Validaciones
        if (!validateDNI(dni)) {
            alert('El DNI debe contener exactamente 8 dígitos numéricos.');
            return;
        }

        if (!validateName(apellidoPaterno)) {
            alert('El apellido paterno solo puede contener letras y espacios.');
            return;
        }

        if (!validateName(apellidoMaterno)) {
            alert('El apellido materno solo puede contener letras y espacios.');
            return;
        }

        if (!sexo) {
            alert('Por favor seleccione el sexo.');
            return;
        }

        // Verificar si el DNI ya existe
        if (employees.some(emp => emp.dni === dni)) {
            alert('Ya existe un empleado con este DNI.');
            return;
        }

        // Crear objeto empleado
        const newEmployee = {
            dni,
            apellidoPaterno,
            apellidoMaterno,
            sexo
        };

        // Agregar al array de empleados
        employees.push(newEmployee);

        // Guardar en localStorage
        localStorage.setItem('employees', JSON.stringify(employees));

        // Actualizar la tabla
        updateTable();

        // Limpiar el formulario
        clearForm();

        // Mostrar mensaje de éxito
        alert('Empleado registrado exitosamente.');
    }

    // Función para eliminar un empleado
    function deleteEmployee(dni) {
        if (confirm('¿Está seguro de eliminar este empleado?')) {
            employees = employees.filter(emp => emp.dni !== dni);
            localStorage.setItem('employees', JSON.stringify(employees));
            updateTable();
        }
    }

    // Función para actualizar la tabla
    function updateTable() {
        // Limpiar la tabla
        tableBody.innerHTML = '';

        // Agregar cada empleado a la tabla
        employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.dni}</td>
                <td>${emp.apellidoPaterno}</td>
                <td>${emp.apellidoMaterno}</td>
                <td>${emp.sexo}</td>
                <td>
                    <button onclick="deleteEmployee('${emp.dni}')" class="btn-delete">
                        Eliminar
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Hacer la función deleteEmployee global para que pueda ser llamada desde el onclick
    window.deleteEmployee = deleteEmployee;

    // Agregar event listener al formulario
    formElement.addEventListener('submit', handleSubmit);

    // Agregar event listener para el botón de reset
    formElement.addEventListener('reset', function(event) {
        setTimeout(clearForm, 0);
    });
});