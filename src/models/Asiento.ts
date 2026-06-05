/**
 * Enumeración de estados de asiento
 * Representa los posibles estados en los que puede estar un asiento
 */
export enum EstadoAsiento {
  DISPONIBLE = "disponible",
  RESERVADO = "reservado",
  OCUPADO = "ocupado"
}

/**
 * Clase Asiento - Representa un asiento individual en la sala
 * 
 * Responsabilidades:
 * - Mantener el estado del asiento
 * - Proporcionar información de ubicación (fila, columna)
 * - Permitir cambios de estado
 */
export class Asiento {
  private readonly numeroFila: number;
  private readonly numeroColumna: number;
  private estado: EstadoAsiento;
  private idReserva: string | null;

  constructor(numeroFila: number, numeroColumna: number) {
    this.numeroFila = numeroFila;
    this.numeroColumna = numeroColumna;
    this.estado = EstadoAsiento.DISPONIBLE;
    this.idReserva = null;
  }

  // Getters para acceso de solo lectura
  obtenerNumeroFila(): number {
    return this.numeroFila;
  }

  obtenerNumeroColumna(): number {
    return this.numeroColumna;
  }

  obtenerEstado(): EstadoAsiento {
    return this.estado;
  }

  obtenerIdReserva(): string | null {
    return this.idReserva;
  }

  /**
   * Marca el asiento como reservado
   * @param idReserva - Identificador único de la reserva
   */
  marcarComoReservado(idReserva: string): void {
    if (this.estado !== EstadoAsiento.DISPONIBLE) {
      throw new Error(
        `No se puede reservar asiento en fila ${this.numeroFila}, columna ${this.numeroColumna}: estado actual es ${this.estado}`
      );
    }
    this.estado = EstadoAsiento.RESERVADO;
    this.idReserva = idReserva;
  }

  /**
   * Marca el asiento como ocupado (después de verificación física)
   * @param idReserva - Identificador único de la reserva
   */
  marcarComoOcupado(idReserva: string): void {
    if (this.estado !== EstadoAsiento.RESERVADO) {
      throw new Error(
        `No se puede ocupar asiento en fila ${this.numeroFila}, columna ${this.numeroColumna}: debe estar reservado primero`
      );
    }
    this.estado = EstadoAsiento.OCUPADO;
    this.idReserva = idReserva;
  }

  /**
   * Libera el asiento (cancela reserva o desocupa)
   */
  liberar(): void {
    this.estado = EstadoAsiento.DISPONIBLE;
    this.idReserva = null;
  }

  /**
   * Determina si el asiento está disponible para reservar
   */
  estaDisponible(): boolean {
    return this.estado === EstadoAsiento.DISPONIBLE;
  }
}
