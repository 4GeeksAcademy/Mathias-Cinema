import * as readlineSync from "readline-sync";
import { ContactoCliente } from "../models/Reserva.ts";
import { SalaCine } from "../models/SalaCine.ts";
import { GestorReservas } from "../services/GestorReservas.ts";
import { BuscadorAsientos } from "../services/BuscadorAsientos.ts";
import { VisualizadorSala } from "../utils/VisualizadorSala.ts";

/**
 * Clase InterfazCLI - Proporciona la interfaz de línea de comandos
 * para que el personal del cine interactúe con el sistema
 * 
 * Responsabilidades:
 * - Mostrar menú principal
 * - Capturar entrada del usuario
 * - Coordinar con el gestor de reservas
 * - Mostrar resultados formateados
 */
export class InterfazCLI {
  private sala: SalaCine;
  private gestorReservas: GestorReservas;
  private activo: boolean;

  constructor() {
    this.sala = new SalaCine();
    this.gestorReservas = new GestorReservas(this.sala);
    this.activo = true;
  }

  /**
   * Inicia el bucle principal de la aplicación
   */
  ejecutar(): void {
    this.mostrarBienvenida();

    while (this.activo) {
      this.mostrarMenuPrincipal();
    }

    this.mostrarDespedida();
  }

  /**
   * Muestra el mensaje de bienvenida
   */
  private mostrarBienvenida(): void {
    console.clear();
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         🎬 SISTEMA DE RESERVA DE ASIENTOS 🎬              ║
║            CINE INDEPENDIENTE LOCAL                       ║
║                                                            ║
║     Versión 1.0 - Gestor de Reservas CLI                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);

    console.log(VisualizadorSala.renderizarLeyenda());
  }

  /**
   * Muestra el mensaje de despedida
   */
  private mostrarDespedida(): void {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              ¡Gracias por usar el sistema!                ║
║              Hasta pronto en el cine 🎬                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
  }

  /**
   * Muestra el menú principal y captura la opción del usuario
   */
  private mostrarMenuPrincipal(): void {
    console.log("\n" + VisualizadorSala.renderizarGrilla(this.sala));
    console.log(VisualizadorSala.renderizarEstadisticas(this.sala));

    console.log(`
╔════════════════════════════════════════════════════════════╗
║               MENÚ DE OPCIONES DISPONIBLES                ║
╠════════════════════════════════════════════════════════════╣
║  1. Reservar 1 asiento individual                         ║
║  2. Reservar 2 asientos para pareja                       ║
║  3. Reservar grupo de asientos específicos                ║
║  4. Reservar asientos por coordenadas exactas             ║
║  5. Ver todas las opciones de asientos disponibles        ║
║  6. Ver reservas activas                                  ║
║  7. Confirmar reserva                                     ║
║  8. Cancelar reserva                                      ║
║  9. Ver historial de reservas                             ║
║  0. Salir                                                 ║
╚════════════════════════════════════════════════════════════╝
    `);

    const opcion = readlineSync.question("Selecciona una opción (0-9): ");

    switch (opcion) {
      case "1":
        this.opcionReservarIndividual();
        break;
      case "2":
        this.opcionReservarPareja();
        break;
      case "3":
        this.opcionReservarGrupo();
        break;
      case "4":
        this.opcionReservarEspecificos();
        break;
      case "5":
        this.opcionVerOpcionesDisponibles();
        break;
      case "6":
        this.opcionVerReservasActivas();
        break;
      case "7":
        this.opcionConfirmarReserva();
        break;
      case "8":
        this.opcionCancelarReserva();
        break;
      case "9":
        this.opcionVerHistorial();
        break;
      case "0":
        this.activo = false;
        break;
      default:
        console.log(VisualizadorSala.renderizarError("Opción no válida"));
    }
  }

  /**
   * Captura información de contacto del cliente
   */
  private capturarContactoCliente(): ContactoCliente {
    const nombre = readlineSync.question("Nombre del cliente: ");
    const telefono = readlineSync.question("Teléfono de contacto: ");
    const correo = readlineSync.question("Correo electrónico (opcional): ");

    return {
      nombre,
      telefono,
      correo: correo || undefined
    };
  }

  /**
   * Opción 1: Reservar 1 asiento individual
   */
  private opcionReservarIndividual(): void {
    console.log("\n--- Reservar Asiento Individual ---");

    const contacto = this.capturarContactoCliente();
    const reserva = this.gestorReservas.reservarAsientoIndividual(contacto);

    if (reserva) {
      console.log(VisualizadorSala.renderizarExito("Asiento reservado exitosamente"));
      console.log(VisualizadorSala.renderizarReserva(reserva));
    } else {
      console.log(
        VisualizadorSala.renderizarError(
          "No hay asientos individuales disponibles"
        )
      );
    }

    readlineSync.question("\nPresiona ENTER para continuar...");
  }

  /**
   * Opción 2: Reservar 2 asientos para pareja
   */
  private opcionReservarPareja(): void {
    console.log("\n--- Reservar Asientos para Pareja ---");

    const contacto = this.capturarContactoCliente();
    const reserva = this.gestorReservas.reservarParAsientos(contacto);

    if (reserva) {
      console.log(VisualizadorSala.renderizarExito("Asientos para pareja reservados exitosamente"));
      console.log(VisualizadorSala.renderizarReserva(reserva));
    } else {
      console.log(
        VisualizadorSala.renderizarError(
          "No hay pares de asientos contiguos disponibles"
        )
      );
    }

    readlineSync.question("\nPresiona ENTER para continuar...");
  }

  /**
   * Opción 3: Reservar grupo de asientos contiguos
   */
  private opcionReservarGrupo(): void {
    console.log("\n--- Reservar Grupo de Asientos ---");

    const cantidad = parseInt(
      readlineSync.question(
        "¿Cuántos asientos necesitas? (1-10): ",
        { limit: /^[1-9]\d?$/ }
      )
    );

    if (cantidad < 1 || cantidad > 10) {
      console.log(VisualizadorSala.renderizarError("Cantidad inválida"));
      readlineSync.question("\nPresiona ENTER para continuar...");
      return;
    }

    const contacto = this.capturarContactoCliente();
    const reserva = this.gestorReservas.reservarGrupoAsientos(cantidad, contacto);

    if (reserva) {
      console.log(VisualizadorSala.renderizarExito(`${cantidad} asientos reservados exitosamente`));
      console.log(VisualizadorSala.renderizarReserva(reserva));
    } else {
      console.log(
        VisualizadorSala.renderizarError(
          `No hay ${cantidad} asientos contiguos disponibles`
        )
      );
    }

    readlineSync.question("\nPresiona ENTER para continuar...");
  }

  /**
   * Opción 4: Reservar asientos por coordenadas exactas
   */
  private opcionReservarEspecificos(): void {
    console.log("\n--- Reservar Asientos por Coordenadas ---");
    console.log("Formato: Fila (1-8), Columna (1-10)");

    const asientosDeseados: [number, number][] = [];

    while (true) {
      const fila = readlineSync.question(
        "Fila (o presiona ENTER para terminar): "
      );

      if (fila === "") break;

      const columna = readlineSync.question("Columna: ");

      try {
        const f = parseInt(fila) - 1; // Convertir a índice (0-based)
        const c = parseInt(columna) - 1;

        asientosDeseados.push([f, c]);
        console.log(
          VisualizadorSala.renderizarInfo(
            `Asiento Fila ${f + 1}, Columna ${c + 1} añadido`
          )
        );
      } catch (error) {
        console.log(VisualizadorSala.renderizarError("Coordenadas inválidas"));
      }
    }

    if (asientosDeseados.length === 0) {
      console.log(VisualizadorSala.renderizarError("No seleccionaste asientos"));
      readlineSync.question("\nPresiona ENTER para continuar...");
      return;
    }

    const contacto = this.capturarContactoCliente();

    try {
      const reserva = this.gestorReservas.reservarAsientosEspecificos(
        asientosDeseados,
        contacto
      );

      if (reserva) {
        console.log(VisualizadorSala.renderizarExito("Asientos reservados exitosamente"));
        console.log(VisualizadorSala.renderizarReserva(reserva));
      } else {
        console.log(
          VisualizadorSala.renderizarError(
            "Uno o más asientos no están disponibles"
          )
        );
      }
    } catch (error) {
      console.log(
        VisualizadorSala.renderizarError(
          error instanceof Error ? error.message : "Error desconocido"
        )
      );
    }

    readlineSync.question("\nPresiona ENTER para continuar...");
  }

  /**
   * Opción 5: Ver todas las opciones de asientos disponibles
   */
  private opcionVerOpcionesDisponibles(): void {
    console.log("\n--- Opciones de Asientos Disponibles ---");

    const cantidad = parseInt(
      readlineSync.question(
        "¿Para cuántos asientos contiguos? (1-10): ",
        { limit: /^[1-9]\d?$/ }
      )
    );

    const grupos = BuscadorAsientos.buscarTodosLosGruposDisponibles(
      this.sala,
      cantidad
    );

    if (grupos.length === 0) {
      console.log(
        VisualizadorSala.renderizarInfo(
          `No hay ${cantidad} asientos contiguos disponibles`
        )
      );
    } else {
      console.log(`\n✓ Se encontraron ${grupos.length} opciones disponibles:\n`);

      for (let i = 0; i < Math.min(10, grupos.length); i++) {
        const grupo = grupos[i];
        console.log(
          `  ${i + 1}. Fila ${grupo.filaInicio + 1}, Columnas ${grupo.columnaInicio + 1}-${grupo.columnaInicio + cantidad}`
        );
      }

      if (grupos.length > 10) {
        console.log(`  ... y ${grupos.length - 10} opciones más`);
      }
    }

    readlineSync.question("\nPresiona ENTER para continuar...");
  }

  /**
   * Opción 6: Ver reservas activas
   */
  private opcionVerReservasActivas(): void {
    console.log("\n--- Reservas Activas ---");

    const activas = this.gestorReservas.obtenerReservasActivas();

    if (activas.length === 0) {
      console.log(VisualizadorSala.renderizarInfo("No hay reservas activas"));
    } else {
      console.log(`\n✓ Hay ${activas.length} reserva(s) activa(s):\n`);

      for (const reserva of activas) {
        console.log(VisualizadorSala.renderizarReserva(reserva));
      }
    }

    readlineSync.question("\nPresiona ENTER para continuar...");
  }

  /**
   * Opción 7: Confirmar reserva
   */
  private opcionConfirmarReserva(): void {
    console.log("\n--- Confirmar Reserva ---");

    const idReserva = readlineSync.question("ID de la reserva a confirmar: ");

    try {
      this.gestorReservas.confirmarReserva(idReserva);
      const reserva = this.gestorReservas.obtenerReserva(idReserva);
      console.log(VisualizadorSala.renderizarExito("Reserva confirmada exitosamente"));
      if (reserva) {
        console.log(VisualizadorSala.renderizarReserva(reserva));
      }
    } catch (error) {
      console.log(
        VisualizadorSala.renderizarError(
          error instanceof Error ? error.message : "Error desconocido"
        )
      );
    }

    readlineSync.question("\nPresiona ENTER para continuar...");
  }

  /**
   * Opción 8: Cancelar reserva
   */
  private opcionCancelarReserva(): void {
    console.log("\n--- Cancelar Reserva ---");

    const idReserva = readlineSync.question("ID de la reserva a cancelar: ");

    const confirmacion = readlineSync.keyInYN(
      "¿Estás seguro que deseas cancelar esta reserva? "
    );

    if (!confirmacion) {
      console.log(VisualizadorSala.renderizarInfo("Cancelación abortada"));
      readlineSync.question("\nPresiona ENTER para continuar...");
      return;
    }

    try {
      this.gestorReservas.cancelarReserva(idReserva);
      console.log(VisualizadorSala.renderizarExito("Reserva cancelada exitosamente"));
    } catch (error) {
      console.log(
        VisualizadorSala.renderizarError(
          error instanceof Error ? error.message : "Error desconocido"
        )
      );
    }

    readlineSync.question("\nPresiona ENTER para continuar...");
  }

  /**
   * Opción 9: Ver historial de reservas
   */
  private opcionVerHistorial(): void {
    console.log("\n--- Historial de Reservas ---");

    const historial = this.gestorReservas.obtenerHistorialReservas();

    if (historial.length === 0) {
      console.log(VisualizadorSala.renderizarInfo("No hay reservas en el historial"));
    } else {
      console.log(`\n✓ Total de reservas: ${historial.length}\n`);

      for (const registro of historial) {
        console.log(`
  ID: ${registro.idReserva}
  Estado: ${registro.estado.toUpperCase()}
  Cliente: ${registro.cliente.nombre}
  Asientos: ${registro.cantidadAsientos}
  Fecha: ${registro.fechaCreacion.toLocaleString()}
  ${"─".repeat(50)}`);
      }
    }

    readlineSync.question("\nPresiona ENTER para continuar...");
  }
}
