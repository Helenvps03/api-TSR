import Express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
//import Cors from 'cors';

const stringConexion = 'mongodb+srv://Yadira:1037651286@proyectotsr.beekf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const client = new MongoClient(stringConexion, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let baseDeDatos;

const app = Express();

app.use(Express.json());
//app.use(Cors());

app.get('/productos', (req, res) => {
  console.log('alguien hizo get en la ruta /productos');
  baseDeDatos.collection('NuevosProductos')
  .find()
  .limit(50)
  .toArray((err, result) => {
    if (err) {
      res.status(500).send('Error consultando los productos');
    } else {
      res.json(result);
    }
  });
});

app.post('/productos/nuevo', (req, res) => {
    console.log(req);
    const datosProductos = req.body;
    console.log('llaves: ', Object.keys(datosProductos));
    try {
      if (
        Object.keys(datosProductos).includes('id') &&
        Object.keys(datosProductos).includes('description') &&
        Object.keys(datosProductos).includes('value') &&
        Object.keys(datosProductos).includes('state') 
      ) {
        // implementar código para crear vehículo en la BD
        baseDeDatos.collection('NuevosProductos').insertOne(datosProductos, (err, result) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
              } else {
                console.log(result);
                res.sendStatus(200);
              }
            });
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    } catch {
      res.sendStatus(500);
    }
  }); 

app.patch('/productos/editar', (req, res) => {
    const edicion = req.body;
    console.log(edicion);
    const filtroProducto = { _id: new ObjectId(edicion.id) };
    delete edicion.id;
    const operacion = {
      $set: edicion,
    };
    baseDeDatos
      .collection('NuevosProductos')
      .findOneAndUpdate(
        filtroProducto,
        operacion,
        { upsert: true, returnOriginal: true },
        (err, result) => {
          if (err) {
            console.error('error actualizando el producto: ', err);
            res.sendStatus(500);
          } else {
            console.log('actualizado con exito');
            res.sendStatus(200);
          }
        }
      );
});

app.delete('/productos/eliminar', (req, res) => {
    const filtroProducto = { _id: new ObjectId(req.body.id) };
    baseDeDatos.collection('NuevosProductos').deleteOne(filtroProducto, (err, result) => {
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
      baseDeDatos = db.db('productos');
      console.log('baseDeDatos exitosa');
      return app.listen(5000, () => {
        console.log('escuchando puerto 5000');
      });
    });
  };
  
  main();