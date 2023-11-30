const express = require('express'); // Represents API being created
const app = express();
const PORT = 8080;

app.use(express.json()) // Applies middleware to parse incoming json data

app.get('/spices', (req, res) => {
    res.status(200).send({
        spice: 'sweet',
        size: '16oz'
    })
});

app.post('/spices/:id', (req, res) => {
    const { id } = req.params;
    const { size } = req.body;

    if (!size) {
        res.status(418).send({ message: 'Need size of spice mix! ' })
    }

    res.send({
        spices: `🧂 with your ${size} and ID of ${id}`,
    });
});

app.listen(
    PORT,
    () => console.log(`Turned on http://localhost:${PORT}`)
)