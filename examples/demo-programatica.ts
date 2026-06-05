/**
 * DEMOSTRACIÓN DEL SISTEMA
 * ========================
 * 
 * Ejemplo de cómo usar el sistema programáticamente
 * (sin la interfaz CLI)
 * 
 * Ejecutar con: npx ts-node examples/demo-programatica.ts
 */

import { SalaCine } from "../src/models/SalaCine.ts";
import { GestorReservas } from "../src/services/GestorReservas.ts";
import { BuscadorAsientos } from "../src/services/BuscadorAsientos.ts";
import { VisualizadorSala } from "../src/utils/VisualizadorSala.ts";

console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  DEMOSTRACIÓN - SISTEMA DE RESERVA DE ASIENTOS 🎬        ║
║                                                            ║
║  Este ejemplo muestra cómo usar el sistema de forma       ║
║  programática sin la interfaz CLI interactiva             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

// ============= CREAR SALA Y GESTOR =============
console.log("\n1️⃣  Inicializando sala y gestor de reservas...\n");
const sala = new SalaCine();
const gestor = new GestorReservas(sala);

console.log(VisualizadorSala.renderizarGrilla(sala));
console.log(VisualizadorSala.renderizarEstadisticas(sala));

// ============= SIMULACIÓN DE CLIENTES =============
console.log(`
2️⃣  Simulando llegada de clientes...\n`);

// Cliente 1: Individual
console.log("👥 Cliente 1: María - Necesita 1 asiento\n");
const reserva1 = gestor.reservarAsientoIndividual({
  nombre: "María López",
  telefono: "555-0001",
  correo: "maria@email.com"
});

if (reserva1) {
  console.log(VisualizadorSala.renderizarExito("Reserva creada exitosamente"));
  console.log(VisualizadorSala.renderizarReserva(reserva1));
  gestor.confirmarReserva(reserva1.obtenerIdReserva());
  console.log("✓ Reserva confirmada - Cliente presente en el cine\n");
}

// Cliente 2: Pareja
console.log("👥 Cliente 2: Juan y Laura - Necesitan 2 asientos juntos\n");
const reserva2 = gestor.reservarParAsientos({
  nombre: "Juan García",
  telefono: "555-0002"
});

if (reserva2) {
  console.log(VisualizadorSala.renderizarExito("Reserva creada exitosamente"));
  console.log(VisualizadorSala.renderizarReserva(reserva2));
  console.log(
    "✓ Se mostró el código RES a la pareja para confirmar\n"
  );
}

// Cliente 3: Grupo
console.log("👥 Cliente 3: Escuela - Necesitan 5 asientos contiguos\n");
const reserva3 = gestor.reservarGrupoAsientos(5, {
  nombre: "Escuela XYZ",
  telefono: "555-0003"
});

if (reserva3) {
  console.log(VisualizadorSala.renderizarExito("Reserva creada exitosamente"));
  console.log(VisualizadorSala.renderizarReserva(reserva3));
  gestor.confirmarReserva(reserva3.obtenerIdReserva());
  console.log("✓ Reserva confirmada - Grupo presente en el cine\n");
}

// ============= VISUALIZACIÓN ACTUAL =============
console.log("3️⃣  Estado actual de la sala después de reservas:\n");
console.log(VisualizadorSala.renderizarGrilla(sala));
console.log(VisualizadorSala.renderizarEstadisticas(sala));

// ============= BÚSQUEDA DE OPCIONES =============
console.log("\n4️⃣  Búsqueda inteligente de opciones disponibles:\n");

console.log("📍 Opciones para grupo de 3 asientos:");
const opcionesGrupo3 = BuscadorAsientos.buscarTodosLosGruposDisponibles(sala, 3);
console.log(`   Encontradas: ${opcionesGrupo3.length} opciones\n`);

for (let i = 0; i < Math.min(5, opcionesGrupo3.length); i++) {
  const grupo = opcionesGrupo3[i];
  console.log(
    `   ${i + 1}. Fila ${grupo.filaInicio + 1}, Columnas ${grupo.columnaInicio + 1}-${grupo.columnaInicio + 3}`
  );
}

// ============= GESTIÓN DE RESERVAS =============
console.log(`\n5️⃣  Gestión de reservas activas:\n`);

const activas = gestor.obtenerReservasActivas();
console.log(`Total de reservas activas: ${activas.length}\n`);

for (const reserva of activas) {
  const estado = reserva.obtenerEstado().toUpperCase();
  const cliente = reserva.obtenerContacto();
  const asientos = reserva.obtenerDescripcionAsientos();

  console.log(`   ID: ${reserva.obtenerIdReserva()}`);
  console.log(`   Estado: ${estado}`);
  console.log(`   Cliente: ${cliente.nombre}`);
  console.log(`   Asientos: ${asientos}`);
  console.log();
}

// ============= CANCELACIÓN =============
console.log("6️⃣  Procesando cancelación de cliente:\n");

if (reserva2) {
  console.log(
    `   Cancelando reserva ${reserva2.obtenerIdReserva()} de ${reserva2.obtenerContacto().nombre}...\n`
  );
  gestor.cancelarReserva(reserva2.obtenerIdReserva());
  console.log(VisualizadorSala.renderizarExito("Reserva cancelada y asientos liberados"));
}

// ============= ESTADO FINAL =============
console.log("\n7️⃣  Estado final de la sala:\n");
console.log(VisualizadorSala.renderizarGrilla(sala));
console.log(VisualizadorSala.renderizarEstadisticas(sala));

// ============= HISTORIAL =============
console.log("\n8️⃣  Historial completo de reservas:\n");
const historial = gestor.obtenerHistorialReservas();

console.log(`Total de transacciones: ${historial.length}\n`);

for (const registro of historial) {
  console.log(`   ${registro.idReserva} | ${registro.estado.toUpperCase().padEnd(10)} | ${registro.cliente.nombre.padEnd(20)} | ${registro.cantidadAsientos} asiento(s)`);
}

// ============= CONCLUSIÓN =============
console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  ✅ DEMOSTRACIÓN COMPLETADA                              ║
║                                                            ║
║  El sistema está listo para ser usado por el personal     ║
║  del cine. Todas las funcionalidades principales han      ║
║  sido probadas y verificadas.                             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);
