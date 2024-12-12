import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let estadoActual = []; // Aquí se guarda el estado de las cartas

// Recuperar el estado actual
app.get('/api/items', (req, res) => {
    if (!Array.isArray(estadoActual)) {
        estadoActual = []; // Asegura que sea un arreglo
    }
    res.json(estadoActual);
});


// Guardar el estado actual
app.post('/api/items', (req, res) => {
    estadoActual = req.body; // Sobrescribe el estado con el nuevo
    res.status(201).json({ message: 'Estado guardado correctamente.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
