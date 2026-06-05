import { Asiento } from "../models/Asiento.ts";
import { SalaCine } from "../models/SalaCine.ts";

/**
 * Interfaz para representar un grupo de asientos contiguos disponibles
 */
export interface GrupoAsientosDisponibles {
  filaInicio: number;
  columnaInicio: number;
  cantidad: number;
  asientos: Asiento[];
}

/**
 * Clase BuscadorAsientos - Encargada de encontrar asientos disponibles
 * con estrategias inteligentes
 * 
 * Responsabilidades:
 * - Encontrar asientos individuales disponibles
 * - Buscar pares de asientos contiguos (para parejas)
 * - Buscar grupos de asientos contiguos (para grupos)
 * - Optimizar búsqueda por preferencia de ubicación
 */
export class BuscadorAsientos {
  /**
   * Busca un asiento individual disponible (si existe)
   * Preferencia: inicio desde el medio de la sala hacia los lados
   * 
   * @returns Asiento disponible o null si no hay
   */
  static buscarAsientoIndividual(sala: SalaCine): Asiento | null {
    const dimensiones = sala.obtenerDimensiones();
    const filaMedia = Math.floor(dimensiones.filas / 2);

    // Estrategia: buscar desde la mitad de la sala hacia arriba y abajo alternadamente
    for (let offset = 0; offset < dimensiones.filas; offset++) {
      // Intentar fila hacia arriba
      if (filaMedia - offset >= 0) {
        const asiento = this.buscarAsientoEnFila(
          sala,
          filaMedia - offset
        );
        if (asiento) return asiento;
      }

      // Intentar fila hacia abajo
      if (filaMedia + offset < dimensiones.filas) {
        const asiento = this.buscarAsientoEnFila(
          sala,
          filaMedia + offset
        );
        if (asiento) return asiento;
      }
    }

    return null;
  }

  /**
   * Busca dos asientos contiguos disponibles (para parejas)
   * Preferencia: ubicaciones centrales
   * 
   * @returns Arreglo de 2 asientos contiguos o null
   */
  static buscarParAsientos(sala: SalaCine): Asiento[] | null {
    const dimensiones = sala.obtenerDimensiones();
    const filaMedia = Math.floor(dimensiones.filas / 2);

    // Estrategia: buscar pares desde la mitad alternadamente
    for (let offset = 0; offset < dimensiones.filas; offset++) {
      if (filaMedia - offset >= 0) {
        const par = this.buscarParEnFila(sala, filaMedia - offset);
        if (par) return par;
      }

      if (filaMedia + offset < dimensiones.filas) {
        const par = this.buscarParEnFila(sala, filaMedia + offset);
        if (par) return par;
      }
    }

    return null;
  }

  /**
   * Busca un grupo de n asientos contiguos disponibles
   * 
   * @param sala - Instancia de la sala
   * @param cantidadSolicitada - Cantidad de asientos contiguos requeridos
   * @returns Arreglo de asientos contiguos o null
   */
  static buscarGrupoAsientos(
    sala: SalaCine,
    cantidadSolicitada: number
  ): Asiento[] | null {
    if (cantidadSolicitada < 1) {
      throw new Error("La cantidad de asientos debe ser mayor a 0");
    }

    const dimensiones = sala.obtenerDimensiones();
    const filaMedia = Math.floor(dimensiones.filas / 2);

    // Buscar grupos desde la mitad alternadamente
    for (let offset = 0; offset < dimensiones.filas; offset++) {
      if (filaMedia - offset >= 0) {
        const grupo = this.buscarGrupoEnFila(
          sala,
          filaMedia - offset,
          cantidadSolicitada
        );
        if (grupo) return grupo;
      }

      if (filaMedia + offset < dimensiones.filas) {
        const grupo = this.buscarGrupoEnFila(
          sala,
          filaMedia + offset,
          cantidadSolicitada
        );
        if (grupo) return grupo;
      }
    }

    return null;
  }

  /**
   * Busca todos los grupos disponibles de una cantidad específica
   * Útil para mostrar opciones al cliente
   * 
   * @param sala - Instancia de la sala
   * @param cantidadSolicitada - Cantidad de asientos contiguos
   * @returns Arreglo de todos los grupos disponibles
   */
  static buscarTodosLosGruposDisponibles(
    sala: SalaCine,
    cantidadSolicitada: number
  ): GrupoAsientosDisponibles[] {
    const grupos: GrupoAsientosDisponibles[] = [];
    const dimensiones = sala.obtenerDimensiones();

    for (let fila = 0; fila < dimensiones.filas; fila++) {
      for (
        let columnaInicio = 0;
        columnaInicio <= dimensiones.columnasporFila - cantidadSolicitada;
        columnaInicio++
      ) {
        const grupo = this.validarGrupoEnFila(
          sala,
          fila,
          columnaInicio,
          cantidadSolicitada
        );

        if (grupo) {
          grupos.push({
            filaInicio: fila,
            columnaInicio: columnaInicio,
            cantidad: cantidadSolicitada,
            asientos: grupo
          });
        }
      }
    }

    return grupos;
  }

  // ========== MÉTODOS PRIVADOS ==========

  /**
   * Busca un asiento disponible en una fila específica
   * Estrategia: comenzar desde el medio de la fila hacia los lados
   */
  private static buscarAsientoEnFila(
    sala: SalaCine,
    numeroFila: number
  ): Asiento | null {
    const asientosPorFila = sala.obtenerAsientosPorFila(numeroFila);
    const columnaMedia = Math.floor(asientosPorFila.length / 2);

    // Buscar desde el medio alternando izquierda y derecha
    for (let offset = 0; offset < asientosPorFila.length; offset++) {
      // Probar a la derecha
      if (columnaMedia + offset < asientosPorFila.length) {
        const asiento = asientosPorFila[columnaMedia + offset];
        if (asiento.estaDisponible()) return asiento;
      }

      // Probar a la izquierda
      if (columnaMedia - offset >= 0 && offset > 0) {
        const asiento = asientosPorFila[columnaMedia - offset];
        if (asiento.estaDisponible()) return asiento;
      }
    }

    return null;
  }

  /**
   * Busca dos asientos contiguos en una fila específica
   */
  private static buscarParEnFila(
    sala: SalaCine,
    numeroFila: number
  ): Asiento[] | null {
    return this.buscarGrupoEnFila(sala, numeroFila, 2);
  }

  /**
   * Busca un grupo de n asientos contiguos en una fila específica
   */
  private static buscarGrupoEnFila(
    sala: SalaCine,
    numeroFila: number,
    cantidadSolicitada: number
  ): Asiento[] | null {
    const asientosPorFila = sala.obtenerAsientosPorFila(numeroFila);
    const columnaMedia = Math.floor(asientosPorFila.length / 2);

    // Buscar desde el medio hacia los lados
    for (let offset = 0; offset <= asientosPorFila.length; offset++) {
      // Intenta a la derecha
      if (columnaMedia + offset + cantidadSolicitada <= asientosPorFila.length) {
        const grupo = this.validarGrupoEnFila(
          sala,
          numeroFila,
          columnaMedia + offset,
          cantidadSolicitada
        );
        if (grupo) return grupo;
      }

      // Intenta a la izquierda
      if (columnaMedia - offset - cantidadSolicitada >= -1) {
        const inicioColumna = Math.max(0, columnaMedia - offset - cantidadSolicitada + 1);
        const grupo = this.validarGrupoEnFila(
          sala,
          numeroFila,
          inicioColumna,
          cantidadSolicitada
        );
        if (grupo) return grupo;
      }
    }

    return null;
  }

  /**
   * Valida que todos los asientos en un rango sean contiguos y disponibles
   */
  private static validarGrupoEnFila(
    sala: SalaCine,
    numeroFila: number,
    columnaInicio: number,
    cantidad: number
  ): Asiento[] | null {
    const asientos: Asiento[] = [];

    for (let i = 0; i < cantidad; i++) {
      const asiento = sala.obtenerAsiento(numeroFila, columnaInicio + i);
      if (!asiento.estaDisponible()) {
        return null;
      }
      asientos.push(asiento);
    }

    return asientos;
  }
}
