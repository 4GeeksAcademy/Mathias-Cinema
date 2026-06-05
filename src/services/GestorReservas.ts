import { Asiento } from "../models/Asiento.ts";
import { Reserva, ContactoCliente, EstadoReserva } from "../models/Reserva.ts";
import { SalaCine } from "../models/SalaCine.ts";
import { BuscadorAsientos } from "./BuscadorAsientos.ts";

/**
 * Clase GestorReservas - Coordinador central de la lógica de reservas
 * 
 * Responsabilidades:
 * - Crear nuevas reservas
 * - Gestionar el registro de reservas
 * - Coordinar búsqueda y asignación de asientos
 * - Procesar cancelaciones
 * - Mantener historial
 */
export class GestorReservas {
  private sala: SalaCine;
  private reservas: Map<string, Reserva>;
  private numeroReservaSecuencial: number;

  constructor(sala: SalaCine) {
    this.sala = sala;
    this.reservas = new Map();
    this.numeroReservaSecuencial = 1000;
  }

  /**
   * Genera un identificador único para una nueva reserva
   */
  private generarIdReserva(): string {
    this.numeroReservaSecuencial++;
    return `RES-${this.numeroReservaSecuencial}`;
  }

  /**
   * Intenta reservar un asiento individual
   * 
   * @param contacto - Información del cliente
   * @returns La reserva creada o null si no hay asientos disponibles
   */
  reservarAsientoIndividual(contacto: ContactoCliente): Reserva | null {
    const asiento = BuscadorAsientos.buscarAsientoIndividual(this.sala);

    if (!asiento) {
      return null;
    }

    return this.crearReserva([asiento], contacto);
  }

  /**
   * Intenta reservar dos asientos contiguos (para parejas)
   * 
   * @param contacto - Información del cliente
   * @returns La reserva creada o null si no hay pares disponibles
   */
  reservarParAsientos(contacto: ContactoCliente): Reserva | null {
    const asientos = BuscadorAsientos.buscarParAsientos(this.sala);

    if (!asientos) {
      return null;
    }

    return this.crearReserva(asientos, contacto);
  }

  /**
   * Intenta reservar un grupo de n asientos contiguos
   * 
   * @param cantidadSolicitada - Cantidad de asientos requeridos
   * @param contacto - Información del cliente
   * @returns La reserva creada o null si no hay grupo disponible
   */
  reservarGrupoAsientos(
    cantidadSolicitada: number,
    contacto: ContactoCliente
  ): Reserva | null {
    const asientos = BuscadorAsientos.buscarGrupoAsientos(
      this.sala,
      cantidadSolicitada
    );

    if (!asientos) {
      return null;
    }

    return this.crearReserva(asientos, contacto);
  }

  /**
   * Intenta reservar asientos específicos (por coordenadas)
   * Útil cuando el cliente solicita asientos específicos
   * 
   * @param asientosDeseados - Array de [fila, columna] deseados
   * @param contacto - Información del cliente
   * @returns La reserva creada o null si algún asiento no está disponible
   * @throws Error si las coordenadas son inválidas
   */
  reservarAsientosEspecificos(
    asientosDeseados: [number, number][],
    contacto: ContactoCliente
  ): Reserva | null {
    // Validar que todos los asientos existan y estén disponibles
    const asientos: Asiento[] = [];

    for (const [fila, columna] of asientosDeseados) {
      const asiento = this.sala.obtenerAsiento(fila, columna);
      
      if (!asiento.estaDisponible()) {
        return null;
      }

      asientos.push(asiento);
    }

    return this.crearReserva(asientos, contacto);
  }

  /**
   * Crea una reserva confirmando los asientos
   */
  private crearReserva(
    asientos: Asiento[],
    contacto: ContactoCliente
  ): Reserva {
    const idReserva = this.generarIdReserva();

    // Marcar asientos como reservados
    for (const asiento of asientos) {
      asiento.marcarComoReservado(idReserva);
    }

    // Crear objeto de reserva
    const reserva = new Reserva(idReserva, asientos, contacto);

    // Registrar en el sistema
    this.reservas.set(idReserva, reserva);

    return reserva;
  }

  /**
   * Confirma una reserva pendiente
   * 
   * @param idReserva - ID de la reserva a confirmar
   * @returns true si se confirmó correctamente
   * @throws Error si la reserva no existe o no puede confirmarse
   */
  confirmarReserva(idReserva: string): boolean {
    const reserva = this.obtenerReserva(idReserva);

    if (!reserva) {
      throw new Error(`Reserva ${idReserva} no encontrada`);
    }

    reserva.confirmar();
    return true;
  }

  /**
   * Cancela una reserva y libera los asientos
   * 
   * @param idReserva - ID de la reserva a cancelar
   * @returns true si se canceló correctamente
   * @throws Error si la reserva no existe o ya fue cancelada
   */
  cancelarReserva(idReserva: string): boolean {
    const reserva = this.obtenerReserva(idReserva);

    if (!reserva) {
      throw new Error(`Reserva ${idReserva} no encontrada`);
    }

    if (reserva.obtenerEstado() === EstadoReserva.CANCELADA) {
      throw new Error("Esta reserva ya fue cancelada");
    }

    // Liberar asientos
    for (const asiento of reserva.obtenerAsientos()) {
      asiento.liberar();
    }

    // Marcar reserva como cancelada
    reserva.cancelar();

    return true;
  }

  /**
   * Obtiene una reserva por ID
   */
  obtenerReserva(idReserva: string): Reserva | undefined {
    return this.reservas.get(idReserva);
  }

  /**
   * Obtiene todas las reservas activas (no canceladas)
   */
  obtenerReservasActivas(): Reserva[] {
    const activas: Reserva[] = [];

    for (const reserva of this.reservas.values()) {
      if (reserva.obtenerEstado() !== EstadoReserva.CANCELADA) {
        activas.push(reserva);
      }
    }

    return activas;
  }

  /**
   * Obtiene todas las reservas (incluyendo canceladas)
   */
  obtenerTodasLasReservas(): Reserva[] {
    return Array.from(this.reservas.values());
  }

  /**
   * Obtiene el historial completo de reservas
   */
  obtenerHistorialReservas(): Array<{
    idReserva: string;
    estado: EstadoReserva;
    cantidadAsientos: number;
    cliente: ContactoCliente;
    fechaCreacion: Date;
  }> {
    return this.obtenerTodasLasReservas().map((reserva) => ({
      idReserva: reserva.obtenerIdReserva(),
      estado: reserva.obtenerEstado(),
      cantidadAsientos: reserva.obtenerCantidadAsientos(),
      cliente: reserva.obtenerContacto(),
      fechaCreacion: reserva.obtenerFechaCreacion()
    }));
  }

  /**
   * Obtiene cantidad total de reservas creadas
   */
  obtenerTotalReservas(): number {
    return this.reservas.size;
  }

  /**
   * Obtiene cantidad de reservas activas
   */
  obtenerTotalReservasActivas(): number {
    return this.obtenerReservasActivas().length;
  }
}
