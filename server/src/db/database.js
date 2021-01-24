const mongoose = require('mongoose');
mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(res => {
        console.log('Base de datos conectada.')
    })
    .catch(err => {
        console.log('Ha ocurrido un error en la conexión a la BD.');
    });
