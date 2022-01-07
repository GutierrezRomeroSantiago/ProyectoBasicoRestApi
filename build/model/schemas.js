"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedidos = exports.Prendas = void 0;
const mongoose_1 = require("mongoose");
const prendaSchema = new mongoose_1.Schema({
    _tipoPrenda: {
        type: String
    },
    _id: {
        type: Number
    },
    _precioXmayor: {
        type: Number
    },
    _precioPublico: {
        type: Number
    },
    _fechaCompra: {
        type: Date
    },
    _material: {
        type: String
    },
    _paisFabric: {
        type: String
    },
    _pedi: {
        type: Number
    },
    _manga: {
        type: String
    },
    _cremallera: {
        type: Boolean
    },
    _cuello: {
        type: String
    },
    _suela: {
        type: String
    },
    _unidadesEnmercado: {
        type: Number
    },
    _calidad: {
        type: String
    },
    _quilates: {
        type: Number
    },
    _peso: {
        type: Number
    }
});
exports.Prendas = (0, mongoose_1.model)('prendax', prendaSchema);
const pedidoSchema = new mongoose_1.Schema({
    _tipoPedido: {
        type: String
    },
    _id: {
        type: Number
    },
    _precioBase: {
        type: Number
    },
    _diasAprox: {
        type: Number
    },
    _compañia: {
        type: String
    },
    _fechaEnvio: {
        type: Date
    },
    _paisSalida: {
        type: String
    },
    _estado: {
        type: Boolean
    },
    _incremento: {
        type: Number
    },
    _impuesto: {
        type: Number
    },
    _material: {
        type: String
    },
    _volumen: {
        type: Number
    },
    _proteccion: {
        type: Boolean
    }
});
exports.Pedidos = (0, mongoose_1.model)('pedidox', prendaSchema);
