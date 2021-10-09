import Express from "express";
import { MongoClient, ObjectId } from "mongodb";
import Cors from "cors";


const stringConexion = " Aqui va el script de la base de datos de Mongo"

const client = new MongoClient(stringConexion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let testVentas;

const app = Express();

app.use(Express.json());
app.use(Cors());

app.get('/ventas', (req, res) =>{
    console.log('Se hizo get en la ruta /ventas');
    testVentas
      .collection('ventas')
      .find({})
      .limit(50)
      .toArray((err, result) => {
          if (err) {
              res.status(500).send('Error consultando las ventas')
          } else {
              res.json(result);
          }
      })
})

app.post('/ventas/nuevo', (req, res) => {
    console.log(req);
    const datosVentas = req.body;
    console.log('llaves: ', Object.keys(datosVentas));
    try {
        if (
            Object.keys(datosVentas).includes('ID Venta') &&
            Object.keys(datosVentas).includes('Cliente') &&
            Object.keys(datosVentas).includes('N° Documento') &&
            Object.keys(datosVentas).includes('Producto') &&
            Object.keys(datosVentas).includes('Cantidad') &&
            Object.keys(datosVentas).includes('Precio') &&
            Object.keys(datosVentas).includes('Valor Total') &&
            Object.keys(datosVentas).includes('Vendedor') &&
            Object.keys(datosVentas).includes('Estado Venta')
        ) {
            testVentas
            .collection('ventas')
            .insertOne(
                datosVentas, 
                (err, result) => {
                if (err) {
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

app.patch('/ventas/editar', (req, res) => {
    const edicion = req.body;
    console.log(edicion);
    const filtroVentas = {_id: new ObjectId(edicion.id)};
    delete edicion.id;
    const operacion = {
        $set: edicion,
    };
    testVentas
    .collection('ventas')
    .findOneAndUpdate(
        filtroVentas, 
        operacion, 
        {upsert: true, returnOriginal: true},
        (err, result) => {
            if (err) {
                console.error('Error actualizando la venta: ', err);
                res.sendStatus(500);
            } else {
                console.log('Actualizado con exito');
                res.sendStatus(200);
            }
        }
     );
});

app.delete('/ventas/eliminar', (req, res) => {
    const filtroVentas = {_id: new ObjectId(req.body.id)};
    testVentas
    .collection('vehiculo')
    .deleteOne(
        filtroVentas, 
        (err, result) => {
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
        if (err) {
            console.error('Error conectando a la base de datos');
            return 'error';
        }
        testVentas = db.db('ventas');
        console.log('testVentas exitosa');
        return app.listen(5000, () => {
            console.log('Escuchando puerto 5000');
        });
    });
};

main ();