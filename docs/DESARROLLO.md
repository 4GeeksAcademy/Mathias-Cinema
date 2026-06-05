# 🏗️ GUÍA DE DESARROLLO - Sistema de Reserva de Asientos

## Índice
1. [Arquitectura del Proyecto](#arquitectura)
2. [Convenciones de Código](#convenciones)
3. [Patrones Utilizados](#patrones)
4. [Guía de Extensión](#extensión)
5. [Buenas Prácticas](#buenas-prácticas)

---

## Arquitectura

### Estructura de Capas

```
┌─────────────────────────────────────────┐
│          CLI / Interfaz de Usuario      │
│      (InterfazCLI.ts / VisualizadorSala)│
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│      Servicios / Lógica de Negocio     │
│   (GestorReservas, BuscadorAsientos)   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│        Modelos / Entidades de Dominio   │
│     (Asiento, Reserva, SalaCine)       │
└─────────────────────────────────────────┘
```

### Responsabilidades por Capa

#### 1. **Modelos** (`src/models/`)
- Representan entidades del dominio
- Contienen lógica de negocio relacionada a su estado
- Son agnósticos de cómo se usan

**Ejemplo: `Asiento.ts`**
```typescript
// Responsabilidades:
- Mantener estado (DISPONIBLE, RESERVADO, OCUPADO)
- Permitir cambios de estado válidos
- Validar transiciones de estado
```

#### 2. **Servicios** (`src/services/`)
- Coordinan acciones entre múltiples modelos
- Implementan algoritmos complejos
- No contienen lógica de presentación

**Ejemplo: `BuscadorAsientos.ts`**
```typescript
// Responsabilidades:
- Buscar asientos según criterios
- Optimizar búsqueda por ubicación
- Retornar resultados ordenados
```

#### 3. **CLI / Presentación** (`src/cli/`, `src/utils/`)
- Interactúan con el usuario
- Convierten entrada del usuario a modelos
- Presentan resultados de forma legible

---

## Convenciones de Código

### Nombres de Variables

```typescript
// ✅ BIEN - Descriptivo y en español (para contexto local)
const numeroAsientoDisponible = 5;
const contactoClientePrincipal = { nombre: "Juan" };
const estadoActualSala = sala.obtenerEstadisticas();

// ❌ MAL - Ambiguo o demasiado corto
const num = 5;
const c = { nombre: "Juan" };
const stats = sala.obtenerEstadisticas();
```

### Métodos (Getters y Acciones)

```typescript
// ✅ Getters: obtener + NombreDelCampo
obtenerIdReserva(): string
obtenerNumeroFila(): number
obtenerEstado(): EstadoAsiento

// ✅ Acciones: verbo + complemento
marcarComoReservado(idReserva: string): void
confirmarReserva(idReserva: string): boolean
cancelarReserva(idReserva: string): boolean

// ✅ Predicados: es + adjetivo o puede + verbo
estaDisponible(): boolean
esValida(): boolean
puedeReservarse(): boolean
```

### Enumeraciones y Constantes

```typescript
// ✅ Enumeraciones: PascalCase, valores lowercase
enum EstadoAsiento {
  DISPONIBLE = "disponible",
  RESERVADO = "reservado",
  OCUPADO = "ocupado"
}

// ✅ Constantes: UPPER_SNAKE_CASE
const CANTIDAD_FILAS = 8;
const CANTIDAD_COLUMNAS = 10;
const NUMERO_MAXIMO_INTENTOS = 3;
```

---

## Patrones Utilizados

### 1. Patrón: Encapsulamiento Estricto

```typescript
export class Asiento {
  // ❌ NO exponer propiedades
  // public numeroFila: number;
  
  // ✅ SÍ - propiedades privadas
  private readonly numeroFila: number;
  
  // ✅ Getters públicos solo lectura
  obtenerNumeroFila(): number {
    return this.numeroFila;
  }
}
```

**Ventajas:**
- Prevenir cambios accidentales
- Facilitar refactorización interna
- Mantener invariantes

### 2. Patrón: Búsqueda Estratégica

```typescript
/**
 * El algoritmo busca desde el CENTRO hacia los EXTREMOS
 * Esto optimiza para ubicaciones preferidas (centro de la sala)
 */
static buscarAsientoEnFila(sala: SalaCine, numeroFila: number): Asiento | null {
  const asientosPorFila = sala.obtenerAsientosPorFila(numeroFila);
  const columnaMedia = Math.floor(asientosPorFila.length / 2);
  
  for (let offset = 0; offset < asientosPorFila.length; offset++) {
    // Probar a la derecha
    if (columnaMedia + offset < asientosPorFila.length) {
      // ...
    }
    
    // Probar a la izquierda
    if (columnaMedia - offset >= 0 && offset > 0) {
      // ...
    }
  }
}
```

### 3. Patrón: Validación por Excepciones

```typescript
/**
 * Lanzar excepciones para casos de error definitivos
 * Retornar null/false para casos esperados
 */
public marcarComoReservado(idReserva: string): void {
  if (this.estado !== EstadoAsiento.DISPONIBLE) {
    // Error: estado inválido (DEBE fallar)
    throw new Error(`No se puede reservar asiento: estado ${this.estado}`);
  }
}

public static buscarAsientoIndividual(sala: SalaCine): Asiento | null {
  // Retornar null si no hay disponible (caso esperado)
  return null;
}
```

---

## Guía de Extensión

### Caso 1: Agregar nuevo tipo de reserva

**Objetivo:** Reservar asientos específicos para VIP (con cargos extras)

#### Paso 1: Extender el modelo Reserva

```typescript
// En src/models/Reserva.ts

export interface ReservaVIP extends Reserva {
  tipoServicio: "premium" | "VIP";
  cargoPorServicio: number;
}

// O simplemente agregar campo a Reserva existente:
export class Reserva {
  private tipoReserva: "normal" | "vip" = "normal";
  
  obtenerTipoReserva(): string {
    return this.tipoReserva;
  }
}
```

#### Paso 2: Agregar método al GestorReservas

```typescript
// En src/services/GestorReservas.ts

public reservarAsientosVIP(
  cantidadSolicitada: number,
  contacto: ContactoCliente,
  servicios: string[]
): Reserva | null {
  // Búsqueda en secciones VIP (filas 0-2)
  // Lógica especial para VIP
  // ...
}
```

#### Paso 3: Agregar opción en CLI

```typescript
// En src/cli/InterfazCLI.ts

case "10":
  this.opcionReservarVIP();
  break;

private opcionReservarVIP(): void {
  // Nueva interfaz para VIP
  // ...
}
```

---

### Caso 2: Agregar persistencia (Base de Datos)

**Objetivo:** Guardar reservas en una base de datos

#### Paso 1: Crear servicio de persistencia

```typescript
// En src/services/RepositorioReservas.ts

export class RepositorioReservas {
  async guardarReserva(reserva: Reserva): Promise<void> {
    // Conectar a BD
    // Guardar datos
  }

  async obtenerReserva(idReserva: string): Promise<Reserva | null> {
    // Conectar a BD
    // Recuperar datos
  }
}
```

#### Paso 2: Inyectar en GestorReservas

```typescript
export class GestorReservas {
  constructor(
    sala: SalaCine,
    repositorio?: RepositorioReservas
  ) {
    this.sala = sala;
    this.repositorio = repositorio; // Opcional
  }

  private async crearReserva(...): Promise<Reserva> {
    const reserva = new Reserva(...);
    
    if (this.repositorio) {
      await this.repositorio.guardarReserva(reserva);
    }
    
    return reserva;
  }
}
```

---

## Buenas Prácticas

### 1. Tipado Fuerte

```typescript
// ✅ BIEN - Tipos explícitos
function reservarAsientos(
  cantidad: number,
  contacto: ContactoCliente
): Reserva | null {
  // ...
}

// ❌ MAL - Tipos implícitos
function reservarAsientos(cantidad, contacto) {
  // ...
}
```

### 2. Comentarios Significativos

```typescript
// ❌ MAL - Obvi o incorrecto
// Obtener el número de filas
public obtenerNumeroFilas(): number {
  return SalaCine.CANTIDAD_FILAS;
}

// ✅ BIEN - Explica POR QUÉ no QUÉ
/**
 * Estrategia: Buscar desde la mitad de la sala hacia los extremos
 * para optimizar la ocupación de ubicaciones preferidas (centro)
 */
private static buscarAsientoEnFila(
  sala: SalaCine,
  numeroFila: number
): Asiento | null {
  // ...
}
```

### 3. Manejo de Errores

```typescript
// ✅ BIEN - Mensajes descriptivos
throw new Error(
  `No se puede reservar asiento en fila ${fila}, columna ${columna}: estado actual es ${estado}`
);

// ❌ MAL - Vago
throw new Error("Error reservando");
```

### 4. Pruebas

```typescript
// ✅ BIEN - Pruebas específicas
reportarPrueba(
  "Asiento marcado como RESERVADO",
  asiento.obtenerEstado() === EstadoAsiento.RESERVADO &&
    asiento.obtenerIdReserva() === "RES-001"
);

// ❌ MAL - Pruebas genéricas
reportarPrueba(
  "Funciona",
  asiento !== null
);
```

### 5. Immutabilidad Donde Sea Posible

```typescript
// ✅ BIEN - Retornar copias
obtenerAsientos(): Asiento[] {
  return [...this.asientosReservados]; // Copia
}

// ❌ MAL - Retornar referencia
obtenerAsientos(): Asiento[] {
  return this.asientosReservados; // ¡Modificable!
}
```

---

## Testing

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm run test  # (una vez configurado)

# Ejecutar pruebas específicas
npx ts-node tests/pruebas.ts
```

### Escribir Nueva Prueba

```typescript
const sala = new SalaCine();
const asiento = sala.obtenerAsiento(0, 0);

// Arrange (Preparar)
asiento.marcarComoReservado("RES-001");

// Act (Ejecutar)
const estado = asiento.obtenerEstado();

// Assert (Verificar)
reportarPrueba(
  "Descripción clara",
  estado === EstadoAsiento.RESERVADO
);
```

---

## Performance

### Optimizaciones Implementadas

1. **Búsqueda desde Centro:** O(n) optimizado en práctica
2. **Grillas de Asientos:** Acceso O(1) por coordenadas
3. **Map de Reservas:** Búsqueda O(1) por ID

### Posibles Mejoras Futuras

```typescript
// Índices por estado (para optimizar búsquedas)
class SalaCine {
  private indiceAsientosDisponibles: Set<Asiento>;
  // ...
}

// Caché de búsquedas frecuentes
class BuscadorAsientos {
  private cacheGruposDisponibles: Map<number, Asiento[][]>;
  // ...
}
```

---

## Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Code Principles](https://en.wikipedia.org/wiki/Robert_C._Martin)
- [Design Patterns in TypeScript](https://refactoring.guru/design-patterns)

---

**Última actualización:** 2024
**Versión:** 1.0.0
