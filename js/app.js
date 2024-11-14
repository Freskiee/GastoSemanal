
//! Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//! Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
};

//! Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    };

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        console.log(this.gastos);
    };
};

class UI {
    insertarPresupuesto(cantidad) {
        //~ Extrayendo los valores
        const { presupuesto, restante } = cantidad;
        //~ Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    };

    imprimirAlerta(mensaje, tipo) {
        //~ Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert');
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        };

        //~ Mensaje de error
        divMensaje.textContent = mensaje;

        //~ Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //~ Quitar del HTML
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    };

    agregarGastoListado(gastos) {

        this.limpiarHTML(); // Elimina el HTML previo

        //~ Iterar sobre los gastos
        gastos.forEach(gasto => {

            const { cantidad, nombre, id } = gasto;

            //~ Crear un LI
            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            // nuevoGasto.setAttribute('data-id', id); <-- Es lo mismo que el codigo de abajo, es otra manera de hacerlo
            nuevoGasto.dataset.id = id;

            //~ Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">${cantidad}</span>`;

            //~ Boton para borrar el gasto
            const btnBorrar = document.createElement('BUTTON');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times'; // El &times es para agregar una 'X', solo lo detecta si lo usas con innerHTML, no con textContent
            nuevoGasto.appendChild(btnBorrar);

            //~ Agregar al HTML
            gastoListado.appendChild(nuevoGasto);

        });
    };

    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        };
    };
};

//! Instanciar
const ui = new UI();
let presupuesto;

//! Funciones

//* Extrae el presupuesto
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');
    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    };

    //~ Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
};

//* Añade gastos
function agregarGasto(e) {
    e.preventDefault();

    //~ Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //~ Validar
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    };

    //~ Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    //~ Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //~ Mensaje de todo bien!!!
    ui.imprimirAlerta('Gasto agregado correctamente');

    //~ Imprimir los gastos
    const { gastos } = presupuesto;
    ui.agregarGastoListado(gastos);

    //~ Reinicia el formulario
    formulario.reset();

};




