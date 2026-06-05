import { Asiento } from "./Asiento.ts";

/**
 * Enumeración de estados de reserva
 */
export enum EstadoReserva {
  PENDIENTE = "pendiente",
  CONFIRMADA = "confirmada",
  CANCELADA = "cancelada"
}

/**
 * Interfaz para información de contacto del cliente
 */
export interface ContactoCliente {
  nombre: string;
  telefono: string;
  correo?: string;
}

/**
 * Clase Reserva - Representa una reserva de uno o múltiples asientos
 * 
 * Responsabilidades:
 * - Registrar información de la reserva
 * - Mantener referencia a los asientos reservados
 * - Gestionar el estado de la reserva
 * - Proporcionar información de contacto del cliente
 */
export class Reserva {
  private readonly idReserva: string;
  private readonly asientosReservados: Asiento[];
  private readonly contactoCliente: ContactoCliente;
  private estado: EstadoReserva;
  private readonly fechaCreacion: Date;
  private fechaConfirmacion: Date | null;

  constructor(
    idReserva: string,
    asientosReservados: Asiento[],
    contactoCliente: ContactoCliente
  ) {
    if (asientosReservados.length === 0) {
      throw new Error("Una reserva debe contener al menos un asiento");
    }

    this.idReserva = idReserva;
    this.asientosReservados = asientosReservados;
    this.contactoCliente = contactoCliente;
    this.estado = EstadoReserva.PENDIENTE;
    this.fechaCreacion = new Date();
    this.fechaConfirmacion = null;
  }

  // Getters
  obtenerIdReserva(): string {
    return this.idReserva;
  }

  obtenerAsientos(): Asiento[] {
    return [...this.asientosReservados];
  }

  obtenerContacto(): ContactoCliente {
    return { ...this.contactoCliente };
  }

  obtenerEstado(): EstadoReserva {
    return this.estado;
  }

  obtenerFechaCreacion(): Date {
    return new Date(this.fechaCreacion);
  }

  obtenerFechaConfirmacion(): Date | null {
    return this.fechaConfirmacion ? new Date(this.fechaConfirmacion) : null;
  }

  /**
   * Obtiene la cantidad de asientos reservados
   */
  obtenerCantidadAsientos(): number {
    return this.asientosReservados.length;
  }

  /**
   * Obtiene descripción legible de los asientos (ej: "Fila A: 5, 6, 7")
   */
  obtenerDescripcionAsientos(): string {
    const agrupadosPorFila = new Map<number, number[]>();

    for (const asiento of this.asientosReservados) {
      const fila = asiento.obtenerNumeroFila();
      if (!agrupadosPorFila.has(fila)) {
        agrupadosPorFila.set(fila, []);
      }
      agrupadosPorFila.get(fila)!.push(asiento.obtenerNumeroColumna());
    }

    const descripciones: string[] = [];
    for (const [fila, columnas] of agrupadosPorFila) {
      const columnasOrdenadas = columnas.sort((a, b) => a - b);
      descripciones.push(`Fila ${fila + 1}: ${columnasOrdenadas.join(", ")}`);
    }

    return descripciones.join(" | ");
  }

  /**
   * Confirma la reserva
   */
  confirmar(): void {
    if (this.estado !== EstadoReserva.PENDIENTE) {
      throw new Error(
        `No se puede confirmar una reserva en estado: ${this.estado}`
      );
    }
    this.estado = EstadoReserva.CONFIRMADA;
    this.fechaConfirmacion = new Date();
  }

  /**
   * Cancela la reserva
   */
  cancelar(): void {
    if (this.estado === EstadoReserva.CANCELADA) {
      throw new Error("Esta reserva ya fue cancelada");
    }
    this.estado = EstadoReserva.CANCELADA;
  }

  /**
   * Determina si la reserva es válida para confirmar
   */
  esValida(): boolean {
    return (
      this.estado === EstadoReserva.PENDIENTE &&
      this.asientosReservados.length > 0
    );
  }
}
