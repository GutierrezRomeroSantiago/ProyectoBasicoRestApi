"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getPrends = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Prendas.aggregate([
                    {
                        $lookup: {
                            from: 'pedidoxes',
                            localField: '_pedi',
                            foreignField: '_id',
                            as: "correspondiente"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getPedido = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Pedidos.aggregate([
                    {
                        $lookup: {
                            from: 'prendaxes',
                            localField: '_id',
                            foreignField: '_pedi',
                            as: "pedidos"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.postPedido = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, precioBase, diasAprox, companie, fechaenvio, paissalida, estado, incremento, impuesto, material, volumen } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                _id: id,
                _precioBase: precioBase,
                _diasAprox: diasAprox,
                _compañia: companie,
                _fechaEnvio: fechaenvio,
                _paisSalida: paissalida,
                _estado: estado,
                _incremento: incremento,
                _impuesto: impuesto,
                _material: material,
                _volumen: volumen
            };
            const oSchema = new schemas_1.Pedidos(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.getPrenda = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const j = yield schemas_1.Prendas.findOne({
                    _id: id,
                });
                res.json(j);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.updatePedido = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { precioBase, diasAprox, companie, fechaenvio, paissalida, estado, incremento, impuesto, material, volumen } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Pedidos.findOneAndUpdate({
                _id: id,
            }, {
                _id: id,
                _precioBase: precioBase,
                _diasAprox: diasAprox,
                _compañia: companie,
                _fechaEnvio: fechaenvio,
                _paisSalida: paissalida,
                _estado: estado,
                _incremento: incremento,
                _impuesto: impuesto,
                _material: material,
                _volumen: volumen
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.deletePrenda = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.db.conectarBD();
            yield schemas_1.Prendas.findOneAndDelete({ _id: id })
                .then((doc) => {
                if (doc == null) {
                    res.send(`No encontrado`);
                }
                else {
                    res.send('Borrado correcto: ' + doc);
                }
            })
                .catch((err) => res.send('Error: ' + err));
            database_1.db.desconectarBD();
        });
        this._router = (0, express_1.Router)();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/prendap', this.getPrends),
            this._router.get('/prenda/:id', this.getPrenda),
            this._router.post('/pedido', this.postPedido),
            this._router.get('/pedidop', this.getPedido),
            this._router.put('/ped/:id', this.updatePedido),
            this._router.delete('/deleteped/:id', this.deletePrenda);
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;
