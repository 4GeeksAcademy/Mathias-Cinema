import { Asiento, EstadoAsiento } from "../models/Asiento.ts";
import { SalaCine } from "../models/SalaCine.ts";
import { Reserva } from "../models/Reserva.ts";

/**
 * Clase VisualizadorSala - Encargada de renderizar la sala de forma legible
 * con estilos y colores (para terminal)
 * 
 * Utiliza símbolos y caracteres especiales para mejorar la visualización
 */
export class VisualizadorSala {
  // Símbolos para diferentes estados
  private static readonly SIMBOLO_DISPONIBLE = "·";
  private static readonly SIMBOLO_RESERVADO = "R";
  private static readonly SIMBOLO_OCUPADO = "X";

  /**
   * Renderiza la grilla de asientos de la sala
   * Formato visual con numeración de filas y columnas
   */
  static renderizarGrilla(sala: SalaCine): string {
    const dimensiones = sala.obtenerDimensiones();
    let output = "\n";

    // Encabezado de columnas
    output += "   ";
    for (let col = 0; col < dimensiones.columnasporFila; col++) {
      output += ` ${col.toString().padStart(2, " ")}`;
    }
    output += "\n";

    // Línea separadora
    output += "   " + "─".repeat(dimensiones.columnasporFila * 3 + 1) + "\n";

    // Filas
    for (let fila = 0; fila < dimensiones.filas; fila++) {
      output += `${(fila + 1).toString().padStart(2, " ")} │`;

      for (let columna = 0; columna < dimensiones.columnasporFila; columna++) {
        const asiento = sala.obtenerAsiento(fila, columna);
        const simbolo = this.obtenerSimboloAsiento(asiento);
        output += ` ${simbolo} `;
      }

      output += "│\n";
    }

    // Línea separadora final
    output += "   " + "─".repeat(dimensiones.columnasporFila * 3 + 1) + "\n";

    return output;
  }

  /**
   * Obtiene el símbolo que representa el estado de un asiento
   */
  private static obtenerSimboloAsiento(asiento: Asiento): string {
    switch (asiento.obtenerEstado()) {
      case EstadoAsiento.DISPONIBLE:
        return this.SIMBOLO_DISPONIBLE;
      case EstadoAsiento.RESERVADO:
        return this.SIMBOLO_RESERVADO;
      case EstadoAsiento.OCUPADO:
        return this.SIMBOLO_OCUPADO;
      default:
        return "?";
    }
  }

  /**
   * Renderiza estadísticas de la sala
   */
  static renderizarEstadisticas(sala: SalaCine): string {
    const stats = sala.obtenerEstadisticas();
    const barraOcupacion = this.generarBarraProgreso(
      stats.porcentajeOcupacion
    );

    return `
╔════════════════════════════════════════╗
║      ESTADÍSTICAS DE LA SALA          ║
╠════════════════════════════════════════╣
║ Capacidad Total:    ${stats.capacidadTotal.toString().padEnd(20)} ║
║ Disponibles:        ${stats.disponibles.toString().padEnd(20)} ║
║ Reservados:         ${stats.reservados.toString().padEnd(20)} ║
║ Ocupados:           ${stats.ocupados.toString().padEnd(20)} ║
║                                        ║
║ Ocupación: ${barraOcupacion} │
╚════════════════════════════════════════╝`;
  }

  /**
   * Genera una barra visual de progreso
   */
  private static generarBarraProgreso(porcentaje: number): string {
    const longitud = 20;
    const lleno = Math.round((porcentaje / 100) * longitud);
    const vacio = longitud - lleno;

    const barra = "█".repeat(lleno) + "░".repeat(vacio);
    return `${barra} ${porcentaje.toString().padStart(3)}%`;
  }

  /**
   * Renderiza detalles de una reserva específica
   */
  static renderizarReserva(reserva: Reserva): string {
    const contacto = reserva.obtenerContacto();

    return `
╔════════════════════════════════════════╗
║         DETALLES DE RESERVA            ║
╠════════════════════════════════════════╣
║ ID Reserva:    ${reserva.obtenerIdReserva().padEnd(25)} ║
║ Estado:        ${reserva.obtenerEstado().toUpperCase().padEnd(25)} ║
║ Cliente:       ${contacto.nombre.padEnd(25)} ║
║ Teléfono:      ${contacto.telefono.padEnd(25)} ║
║ Asientos:      ${reserva.obtenerCantidadAsientos()} ${reserva.obtenerDescripcionAsientos().substring(0, 18).padEnd(18)} ║
║ Fecha Creación: ${reserva.obtenerFechaCreacion().toLocaleString().padEnd(22)} ║
╚════════════════════════════════════════╝`;
  }

  /**
   * Renderiza leyenda de símbolos
   */
  static renderizarLeyenda(): string {
    return `
┌────────────────────────────────────────┐
│          LEYENDA DE SÍMBOLOS           │
├────────────────────────────────────────┤
│ ${this.SIMBOLO_DISPONIBLE} = Disponible (puede reservarse)   │
│ ${this.SIMBOLO_RESERVADO} = Reservado (no disponible)         │
│ ${this.SIMBOLO_OCUPADO} = Ocupado (cliente presente)         │
└────────────────────────────────────────┘`;
  }

  /**
   * Renderiza un mensaje de error
   */
  static renderizarError(mensaje: string): string {
    return `\n❌ ERROR: ${mensaje}\n`;
  }

  /**
   * Renderiza un mensaje de éxito
   */
  static renderizarExito(mensaje: string): string {
    return `\n✅ ÉXITO: ${mensaje}\n`;
  }

  /**
   * Renderiza un mensaje de información
   */
  static renderizarInfo(mensaje: string): string {
    return `\nℹ️  ${mensaje}\n`;
  }
}
