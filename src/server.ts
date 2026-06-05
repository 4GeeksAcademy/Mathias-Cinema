/**
 * SERVIDOR WEB - Cinema Seat Manager
 * 
 * Servidor Express simple para servir la interfaz web
 * Ejecutar: npm run serve-web
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API endpoints (para futuras integraciones con el backend TypeScript)
app.get('/api/estadisticas', (req, res) => {
    res.json({
        mensaje: 'Endpoint de estadísticas',
        nota: 'Próximamente integrado con el backend TypeScript'
    });
});

app.get('/api/reservas', (req, res) => {
    res.json({
        mensaje: 'Endpoint de reservas',
        nota: 'Próximamente integrado con el backend TypeScript'
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  🎬 Cinema Seat Manager - Servidor Web                ║
║                                                        ║
║  Servidor iniciado correctamente:                     ║
║  📍 http://localhost:${PORT}                           ║
║                                                        ║
║  Abre tu navegador y accede a la URL arriba           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
});
