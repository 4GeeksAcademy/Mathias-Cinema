/**
 * SISTEMA DE RESERVA DE ASIENTOS - CINE INDEPENDIENTE
 * =====================================================
 * 
 * Punto de entrada principal de la aplicación
 * 
 * Arquitectura:
 * - Models: Entidades de dominio (Asiento, Reserva, SalaCine)
 * - Services: Lógica de negocio (GestorReservas, BuscadorAsientos)
 * - CLI: Interfaz de usuario interactiva
 * - Utils: Funciones auxiliares (Visualización)
 * 
 * Stack: TypeScript + Node.js + readline-sync
 */

import { InterfazCLI } from "./cli/InterfazCLI.ts";

// Inicializar y ejecutar la aplicación
const aplicacion = new InterfazCLI();
aplicacion.ejecutar();
