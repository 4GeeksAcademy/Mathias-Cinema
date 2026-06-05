# 🎬 Mathias Cinema - Sistema de Reserva de Asientos

Sistema profesional de gestión de reservas de asientos para un cine independiente, desarrollado con **TypeScript** y **Node.js**. Proporciona una interfaz CLI intuitiva para que el personal del cine maneje de forma eficiente las reservas de asientos.

## 📋 Características

- **Gestión de Sala**: Visualización en tiempo real de los 80 asientos (8 filas × 10 columnas)
- **Búsqueda Inteligente**: Algoritmos optimizados para encontrar:
  - Asientos individuales disponibles
  - Pares de asientos contiguos (para parejas)
  - Grupos de n asientos contiguos
- **Sistema de Reservas**: 
  - Crear, confirmar y cancelar reservas
  - Información de contacto del cliente
  - Historial completo de transacciones
- **Visualización Legible**: 
  - Grilla clara con estados (Disponible, Reservado, Ocupado)
  - Estadísticas en tiempo real (ocupación, disponibilidad)
  - Menú interactivo y amigable

## 🏗️ Arquitectura

```
src/
├── index.ts                          # Punto de entrada
├── models/                           # Entidades de dominio
│   ├── Asiento.ts                   # Representa un asiento individual
│   ├── Reserva.ts                   # Información de reserva
│   └── SalaCine.ts                  # Grilla de asientos de la sala
├── services/                         # Lógica de negocio
│   ├── BuscadorAsientos.ts          # Búsqueda inteligente de asientos
│   └── GestorReservas.ts            # Coordinador de reservas
├── cli/                              # Interfaz de usuario
│   └── InterfazCLI.ts               # Menú interactivo
└── utils/                            # Funciones auxiliares
    └── VisualizadorSala.ts          # Renderizado y formato
```

## 🚀 Instalación

### Requisitos
- Node.js v16.x o superior
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/4GeeksAcademy/Mathias-Cinema.git
cd Mathias-Cinema
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Compilar TypeScript**
```bash
npm run build
```

## ▶️ Uso

### Modo Desarrollo (con ts-node)
```bash
npm run dev
```

### Modo Producción
```bash
npm run build
npm start
```

## 📖 Guía de Usuario

### Menú Principal
El sistema presenta 9 opciones:

1. **Reservar 1 asiento individual**
   - Busca automáticamente el mejor asiento disponible
   - Preferencia: ubicaciones centrales

2. **Reservar 2 asientos para pareja**
   - Encuentra dos asientos contiguos disponibles
   - Ideal para parejas que quieren sentarse juntas

3. **Reservar grupo de asientos específicos**
   - Reserva n asientos contiguos
   - Entrada flexible del usuario

4. **Reservar asientos por coordenadas exactas**
   - El cliente solicita asientos específicos
   - Sistema valida disponibilidad

5. **Ver todas las opciones de asientos disponibles**
   - Muestra todos los grupos disponibles de cierto tamaño
   - Útil para informar al cliente

6. **Ver reservas activas**
   - Listado de todas las reservas vigentes
   - Información detallada de cada una

7. **Confirmar reserva**
   - Confirma una reserva pendiente
   - Debe usarse cuando el cliente se presenta

8. **Cancelar reserva**
   - Cancela una reserva existente
   - Libera automáticamente los asientos

9. **Ver historial de reservas**
   - Registro completo de todas las transacciones
   - Incluye canceladas

## 💡 Ejemplo de Uso

```
1. Personal atiende a cliente que pide 2 asientos para pareja
2. Selecciona opción "2" en el menú
3. Ingresa información: Nombre "Juan García", Teléfono "555-1234"
4. Sistema genera ID: RES-1001
5. Personal confirma al cliente: "Sus asientos son Fila 4, Columnas 5-6"
6. Al llegar el cliente, se confirma la reserva (opción 7)
```

## 🛠️ Tecnologías

| Tecnología | Propósito |
|-----------|----------|
| **TypeScript** | Lenguaje principal con tipado fuerte |
| **Node.js** | Runtime de JavaScript |
| **readline-sync** | Interfaz interactiva en CLI |
| **chalk** | Colores en terminal (opcional) |

## 📊 Ejemplo de Estados

```
Símbolos en la grilla:
· = Disponible (puede reservarse)
R = Reservado (no disponible)
X = Ocupado (cliente presente)

Ejemplo de grilla:
    0   1   2   3   4   5   6   7   8   9
  ─────────────────────────────────────────
1 │ ·  ·  ·  R  R  ·  ·  ·  ·  · │
2 │ ·  ·  X  X  X  ·  ·  R  R  · │
3 │ ·  R  ·  ·  ·  ·  ·  ·  ·  · │
```

## 🎯 Funcionalidades Futuras

- ✅ Interfaz web
- ✅ Base de datos persistente
- ✅ Sistema de pagos online
- ✅ Email de confirmación
- ✅ Mapeo visual de asientos
- ✅ Reservas con descuento por cantidad

## 📝 Principios de Código

- **Responsabilidad Única**: Cada clase tiene una única razón para cambiar
- **Tipado Fuerte**: TypeScript strict mode en toda la aplicación
- **Comentarios Significativos**: Código autodocumentado con JSDoc
- **Mantenibilidad**: Variables con nombres descriptivos
- **Arquitectura Limpia**: Separación clara de capas

## 🔒 Validaciones

- Coordenadas de asientos dentro de rango válido
- Estado de asiento verificado antes de reservar
- Información de contacto completa
- Cantidad de asientos válida

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 👥 Autores

- Desarrollo: Equipo de IA Fullstack
- Cliente: Cine Independiente Local
- Institución: 4Geeks Academy

---

**¿Preguntas?** Contacta al equipo de soporte del proyecto.