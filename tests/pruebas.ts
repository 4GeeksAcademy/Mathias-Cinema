/**
 * PRUEBAS UNITARIAS - SISTEMA DE RESERVA
 * 
 * Verifica que todos los componentes funcionen correctamente
 * Ejecutar con: npx ts-node tests/pruebas.ts
 */

import { Asiento, EstadoAsiento } from "../src/models/Asiento.ts";
import { EstadoReserva } from "../src/models/Reserva.ts";
import { SalaCine } from "../src/models/SalaCine.ts";
import { BuscadorAsientos } from "../src/services/BuscadorAsientos.ts";
import { GestorReservas } from "../src/services/GestorReservas.ts";

// Colores para output
const VERDE = "\x1b[32m";
const ROJO = "\x1b[31m";
const AMARILLO = "\x1b[33m";
const RESET = "\x1b[0m";

let pruebasExitosas = 0;
let pruebasFallidas = 0;

/**
 * Función auxiliar para reportar resultado de prueba
 */
function reportarPrueba(nombre: string, exitosa: boolean, mensaje: string = ""): void {
  if (exitosa) {
    console.log(`${VERDE}✓ EXITO${RESET} - ${nombre}`);
    pruebasExitosas++;
  } else {
    console.log(
      `${ROJO}✗ FALLO${RESET} - ${nombre}${mensaje ? `: ${mensaje}` : ""}`
    );
    pruebasFallidas++;
  }
}

console.log(`
${AMARILLO}═══════════════════════════════════════════════════════${RESET}
${AMARILLO}  PRUEBAS DEL SISTEMA DE RESERVA DE ASIENTOS${RESET}
${AMARILLO}═══════════════════════════════════════════════════════${RESET}
`);

// ============= PRUEBAS DEL MODELO ASIENTO =============
console.log(`\n${AMARILLO}1. Pruebas del Modelo Asiento${RESET}`);

const asiento = new Asiento(0, 0);
reportarPrueba(
  "Asiento creado en estado DISPONIBLE",
  asiento.estaDisponible() && asiento.obtenerEstado() === EstadoAsiento.DISPONIBLE
);

reportarPrueba(
  "Asiento tiene coordenadas correctas",
  asiento.obtenerNumeroFila() === 0 && asiento.obtenerNumeroColumna() === 0
);

asiento.marcarComoReservado("RES-001");
reportarPrueba(
  "Asiento marcado como RESERVADO",
  asiento.obtenerEstado() === EstadoAsiento.RESERVADO &&
    asiento.obtenerIdReserva() === "RES-001"
);

reportarPrueba(
  "Asiento no está disponible después de reservar",
  !asiento.estaDisponible()
);

asiento.liberar();
reportarPrueba(
  "Asiento liberado correctamente",
  asiento.estaDisponible() && asiento.obtenerIdReserva() === null
);

// ============= PRUEBAS DEL MODELO SALA =============
console.log(`\n${AMARILLO}2. Pruebas del Modelo SalaCine${RESET}`);

const sala = new SalaCine();
const dimensiones = sala.obtenerDimensiones();

reportarPrueba(
  "Sala tiene dimensiones correctas",
  dimensiones.filas === 8 && dimensiones.columnasporFila === 10
);

reportarPrueba(
  "Capacidad total de sala es 80",
  sala.obtenerCapacidadTotal() === 80
);

reportarPrueba(
  "Inicialmente todos los asientos están disponibles",
  sala.obtenerAsientosDisponibles() === 80 &&
    sala.obtenerAsientosReservados() === 0 &&
    sala.obtenerAsientosOcupados() === 0
);

const stats = sala.obtenerEstadisticas();
reportarPrueba(
  "Estadísticas iniciales correctas",
  stats.disponibles === 80 &&
    stats.reservados === 0 &&
    stats.ocupados === 0 &&
    stats.porcentajeOcupacion === 0
);

// ============= PRUEBAS DE BÚSQUEDA =============
console.log(`\n${AMARILLO}3. Pruebas del Buscador de Asientos${RESET}`);

const asientoIndividual = BuscadorAsientos.buscarAsientoIndividual(sala);
reportarPrueba(
  "Se encuentra asiento individual disponible",
  asientoIndividual !== null
);

const parAsientos = BuscadorAsientos.buscarParAsientos(sala);
reportarPrueba("Se encuentra par de asientos contiguos", parAsientos !== null && parAsientos.length === 2);

const grupoAsientos = BuscadorAsientos.buscarGrupoAsientos(sala, 3);
reportarPrueba("Se encuentra grupo de 3 asientos contiguos", grupoAsientos !== null && grupoAsientos.length === 3);

// Verificar que existen grupos de 10 disponibles (pero pueden no encontrarse en búsqueda estratégica)
const todosLosGrupos = BuscadorAsientos.buscarTodosLosGruposDisponibles(sala, 10);
reportarPrueba("Se encuentran grupos de 10 asientos contiguos", todosLosGrupos.length > 0);

// ============= PRUEBAS DE RESERVAS =============
console.log(`\n${AMARILLO}4. Pruebas del Gestor de Reservas${RESET}`);

const salaReservas = new SalaCine();
const gestor = new GestorReservas(salaReservas);

const contacto = { nombre: "Juan García", telefono: "555-1234" };

const reserva1 = gestor.reservarAsientoIndividual(contacto);
reportarPrueba(
  "Reserva individual creada exitosamente",
  reserva1 !== null
);

reportarPrueba(
  "Reserva tiene ID válido",
  reserva1 !== null && reserva1.obtenerIdReserva().startsWith("RES-")
);

reportarPrueba(
  "Asiento reservado no está disponible",
  salaReservas.obtenerAsientosDisponibles() === 79
);

const reserva2 = gestor.reservarParAsientos(contacto);
reportarPrueba(
  "Reserva de pareja creada exitosamente",
  reserva2 !== null && reserva2.obtenerCantidadAsientos() === 2
);

if (reserva1) {
  gestor.confirmarReserva(reserva1.obtenerIdReserva());
  const reservaConfirmada = gestor.obtenerReserva(reserva1.obtenerIdReserva());
  reportarPrueba(
    "Reserva confirmada correctamente",
    reservaConfirmada !== undefined && reservaConfirmada.obtenerEstado() === EstadoReserva.CONFIRMADA
  );
}

if (reserva2) {
  const idReserva = reserva2.obtenerIdReserva();
  gestor.cancelarReserva(idReserva);
  const reservaCancelada = gestor.obtenerReserva(idReserva);
  reportarPrueba(
    "Reserva cancelada correctamente",
    reservaCancelada !== undefined && reservaCancelada.obtenerEstado() === EstadoReserva.CANCELADA
  );
}

const todasReservas = gestor.obtenerTodasLasReservas();
reportarPrueba(
  "Se registraron 2 reservas en total",
  todasReservas.length === 2
);

const activasActuales = gestor.obtenerReservasActivas();
reportarPrueba(
  "Solo 1 reserva activa después de cancelar",
  activasActuales.length === 1
);

// Verificar que solo queda 1 asiento reservado (de la primera reserva)
reportarPrueba(
  "Cantidad correcta de asientos después de cancelar",
  salaReservas.obtenerAsientosReservados() === 1 &&
    salaReservas.obtenerAsientosDisponibles() === 79
);

// ============= PRUEBAS DE VALIDACIÓN =============
console.log(`\n${AMARILLO}5. Pruebas de Validación${RESET}`);

try {
  sala.obtenerAsiento(100, 100);
  reportarPrueba("Validación de coordenadas", false, "No lanzó error");
} catch {
  reportarPrueba("Validación de coordenadas inválidas", true);
}

try {
  BuscadorAsientos.buscarGrupoAsientos(sala, 0);
  reportarPrueba("Validación de cantidad 0", false, "No lanzó error");
} catch {
  reportarPrueba("Validación de cantidad 0", true);
}

// ============= RESUMEN =============
console.log(`
${AMARILLO}═══════════════════════════════════════════════════════${RESET}
${AMARILLO}  RESUMEN DE PRUEBAS${RESET}
${AMARILLO}═══════════════════════════════════════════════════════${RESET}

${VERDE}Exitosas: ${pruebasExitosas}${RESET}
${ROJO}Fallidas: ${pruebasFallidas}${RESET}
Total: ${pruebasExitosas + pruebasFallidas}

${pruebasFallidas === 0 ? VERDE + "✓ TODAS LAS PRUEBAS PASARON" + RESET : ROJO + "✗ ALGUNAS PRUEBAS FALLARON" + RESET}
${AMARILLO}═══════════════════════════════════════════════════════${RESET}
`);

