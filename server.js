import Express from "express";

const app = Express();

app.use(Express.json());

app.get('/ventas', (req, res) =>{
    console.log('Se hizo get en la ruta /ventas');
    const ventas = [
        {producto: 'jabon avena', precio: '10000', id: '123'},
        {producto: 'shampoo barra aloe', precio: '20000', id: '456'},
        {producto: 'acondicionador barra', precio: '20000', id: '789'},
    ];
    res.send(ventas);
})