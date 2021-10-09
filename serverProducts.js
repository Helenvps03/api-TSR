import Express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import Cors from 'cors';


const stringConexion = 'mongodb+srv://Bethsy:793722@proyectotsr.beekf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const client = new MongoClient(stringConexion, {useNewUrlParser: true, useUnifiedTopology: true,
});

let conexion;

const app = Express();
app.use(Cors());
app.use(Express.json());
app.get('/products', (req, res) => {
    console.log('alguien hizo get en la ruta /products');
    conexion
    .collection('producto')
    .find({})
    .limit(100)
    .toArray((err, result) => {
        if(err) {
            res.status(500).send('Error consultando los productos');
        } else {
            res.json(result);
        }
    });
});

app.post('/products/new', (req, res) => {
    console.log(req);
    const datosProducto = req.body;
    console.log('llaves: ', Object.keys(datosProducto));
    try {
        if (
            Object.keys(datosProducto).includes('descripcion') && 
            Object.keys(datosProducto).includes('valorUnitario') && 
            Object.keys(datosProducto).includes('Estado')
        ) {
            conexion
            .collection('producto')
            .insertOne(datosProducto, (err, result) => {
                if(err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    console.log(result);
                    res.sendStatus(200);
                }
            });
        } else {
            res.sendStatus(500);
        }
    } catch {
        res.sendStatus(500);
    }

});

app.patch('/products/actualize', (req, res) => {
    const edicion = req.body;
    console.log(edicion);
    const filtroProductos = {_id: new ObjectId(edicion.id)};
    delete edicion.id;
    const operacion = {
        $set:edicion,
    };
    conexion
    .collection('producto')
    .findOneAndUpdate(
        filtroProductos, 
        operacion, 
        {upsert: true, returnOriginal: true}, 
        (err, result) => {
            if (err) {
                console.error('error actualizando el producto: ', err);
                res.sendStatus(500);
            } else{
                console.log('actualizado con exito');
                res.sendStatus(200);
            }
        }
        );
})

app.delete('/products/delete', (req,res) => {
    const filtroProductos = { _id: new ObjectId(req.body.id)};
    conexion
    .collection('producto')
    .deleteOne(filtroProductos, (err,result) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

const main = () => {
    client.connect((err, db) => {
        if(err) {
            console.error('error conectando a la base de datos');
                return 'error';
        }
        conexion = db.db('proyecto')
        console.log('conexión exitosa')
        return app.listen(5000, () => {
            console.log('escuchando puerto 5000');
});
});
};

main();