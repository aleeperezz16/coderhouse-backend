const Contenedor = require("../src/Contenedor");
const router = require("express").Router();

const contenedor = new Contenedor("./data/productos.txt");
const admin = true;

const esAdmin = (req, res, next) => {
  if (!admin)
    res.status(400).json({ error : -1, descripcion: `Ruta '${req.originalUrl}' método '${req.method}' no autorizado` });
  else
    next();
}

const esProductoValido = (data) => {
  return data.nombre && data.descripcion && data.codigo && data.foto && data.precio && data.stock;
}

router.route("/:id?")
  .get((req, res) => {
    if (!req.params.id)
      contenedor.getAll()
        .then(prods => prods ? res.status(200).json(prods) : res.status(404).json({ error: "No hay productos" }))
        .catch(err => res.status(400).json({ error: "Producto " + err.message }));
    else
      contenedor.getById(Number(req.params.id))
        .then(prod => res.status(200).json(prod))
        .catch(err => res.status(400).json({ error: "Producto " + err.message }));
  })

router.route("/:id")
  .put(esAdmin, (req, res) => {
    const nuevoProducto = req.body;

    if (!esProductoValido(nuevoProducto))
      res.sendStatus(400);
    else {
      nuevoProducto.id = Number(req.params.id);
      nuevoProducto.timestamp = new Date().getTime();

      contenedor.save(nuevoProducto)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(400).json({ error: "Producto " + err.message }));
    }
  })
  .delete(esAdmin, (req, res) => {
    contenedor.deleteById(Number(req.params.id))
      .then(() => res.sendStatus(200))
      .catch(err => res.status(400).json({ error: "Producto " + err.message }));
  })

router.route("/")
  .post(esAdmin, (req, res) => {
    const producto = req.body;
    if (!esProductoValido(producto))
      res.sendStatus(400);
    else {
      producto.timestamp = new Date().getTime();
      contenedor.save(producto)
        .then(() => res.sendStatus(201))
        .catch(err => res.status(400).json({ error: "Producto " + err.message }));
    }
  });

module.exports = router;