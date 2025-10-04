// src/index.js
const app = require('./app');

app.listen(app.get('port'), () => {
    console.log('App listening on port ', app.get("port"));
    
});

/*app.listen(port, () => console.log(`Example app listening on port ${port}!`));*/

