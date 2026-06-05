import { Asiento, EstadoAsiento } from "./Asiento.ts";

/**
 * Clase SalaCine - Representa la sala de cine con su grilla de asientos
 * 
 * Configuración:
 * - 8 filas (0-7)
 * - 10 asientos por fila (0-9)
 * 
 * Responsabilidades:
 * - Mantener la grilla de asientos
 * - Proporcionar acceso a asientos individuales
 * - Calcular estadísticas de ocupación
 * - Visualizar el estado actual de la sala
 */
export class SalaCine {
  private static readonly CANTIDAD_FILAS = 8;
  private static readonly CANTIDAD_COLUMNAS = 10;

  private asientos: Asiento[][];

  constructor() {
    this.asientos = this.inicializarAsientos();
  }

  /**
   * Inicializa la grilla de asientos vacía
   */
  private inicializarAsientos(): Asiento[][] {
    const grilla: Asiento[][] = [];

    for (let fila = 0; fila < SalaCine.CANTIDAD_FILAS; fila++) {
      grilla[fila] = [];
      for (let columna = 0; columna < SalaCine.CANTIDAD_COLUMNAS; columna++) {
        grilla[fila][columna] = new Asiento(fila, columna);
      }
    }

    return grilla;
  }

  /**
   * Obtiene un asiento específico por coordenadas
   * @param numeroFila - Número de fila (0-7)
   * @param numeroColumna - Número de columna (0-9)
   * @returns El asiento solicitado
   * @throws Error si las coordenadas son inválidas
   */
  obtenerAsiento(numeroFila: number, numeroColumna: number): Asiento {
    this.validarCoordenadas(numeroFila, numeroColumna);
    return this.asientos[numeroFila][numeroColumna];
  }

  /**
   * Obtiene todos los asientos de una fila
   */
  obtenerAsientosPorFila(numeroFila: number): Asiento[] {
    this.validarFila(numeroFila);
    return [...this.asientos[numeroFila]];
  }

  /**
   * Valida que las coordenadas estén dentro del rango válido
   */
  private validarCoordenadas(numeroFila: number, numeroColumna: number): void {
    if (
      numeroFila < 0 ||
      numeroFila >= SalaCine.CANTIDAD_FILAS ||
      numeroColumna < 0 ||
      numeroColumna >= SalaCine.CANTIDAD_COLUMNAS
    ) {
      throw new Error(
        `Coordenadas inválidas. Rangos válidos: Filas 0-${SalaCine.CANTIDAD_FILAS - 1}, ` +
          `Columnas 0-${SalaCine.CANTIDAD_COLUMNAS - 1}`
      );
    }
  }

  /**
   * Valida que el número de fila sea válido
   */
  private validarFila(numeroFila: number): void {
    if (numeroFila < 0 || numeroFila >= SalaCine.CANTIDAD_FILAS) {
      throw new Error(
        `Número de fila inválido. Rango válido: 0-${SalaCine.CANTIDAD_FILAS - 1}`
      );
    }
  }

  /**
   * Obtiene la cantidad total de asientos en la sala
   */
  obtenerCapacidadTotal(): number {
    return SalaCine.CANTIDAD_FILAS * SalaCine.CANTIDAD_COLUMNAS;
  }

  /**
   * Obtiene la cantidad de asientos disponibles
   */
  obtenerAsientosDisponibles(): number {
    let contador = 0;
    for (let fila of this.asientos) {
      for (let asiento of fila) {
        if (asiento.estaDisponible()) {
          contador++;
        }
      }
    }
    return contador;
  }

  /**
   * Obtiene la cantidad de asientos reservados
   */
  obtenerAsientosReservados(): number {
    let contador = 0;
    for (let fila of this.asientos) {
      for (let asiento of fila) {
        if (asiento.obtenerEstado() === EstadoAsiento.RESERVADO) {
          contador++;
        }
      }
    }
    return contador;
  }

  /**
   * Obtiene la cantidad de asientos ocupados
   */
  obtenerAsientosOcupados(): number {
    let contador = 0;
    for (let fila of this.asientos) {
      for (let asiento of fila) {
        if (asiento.obtenerEstado() === EstadoAsiento.OCUPADO) {
          contador++;
        }
      }
    }
    return contador;
  }

  /**
   * Calcula el porcentaje de ocupación de la sala
   */
  obtenerPorcentajeOcupacion(): number {
    const totalOcupado =
      this.obtenerAsientosReservados() + this.obtenerAsientosOcupados();
    return Math.round((totalOcupado / this.obtenerCapacidadTotal()) * 100);
  }

  /**
   * Calcula el porcentaje de disponibilidad
   */
  obtenerPorcentajeDisponibilidad(): number {
    return 100 - this.obtenerPorcentajeOcupacion();
  }

  /**
   * Obtiene información estadística de la sala
   */
  obtenerEstadisticas(): {
    capacidadTotal: number;
    disponibles: number;
    reservados: number;
    ocupados: number;
    porcentajeOcupacion: number;
  } {
    return {
      capacidadTotal: this.obtenerCapacidadTotal(),
      disponibles: this.obtenerAsientosDisponibles(),
      reservados: this.obtenerAsientosReservados(),
      ocupados: this.obtenerAsientosOcupados(),
      porcentajeOcupacion: this.obtenerPorcentajeOcupacion()
    };
  }

  /**
   * Obtiene información de dimensiones de la sala
   */
  obtenerDimensiones(): {
    filas: number;
    columnasporFila: number;
  } {
    return {
      filas: SalaCine.CANTIDAD_FILAS,
      columnasporFila: SalaCine.CANTIDAD_COLUMNAS
    };
  }
}
