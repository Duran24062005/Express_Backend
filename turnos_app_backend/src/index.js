const express = require('express');


const app = express();

app.set('port', 3000)


app.get('/', (req, res) => {
    res.send('Hola desde turnos app');
});

app.listen(app.get('port'), () => {
    console.log(`🚀 Server listen in http://localhost:${app.get('port')}`);
    
});


module.exports = app;