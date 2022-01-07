import {Request, Response, Router } from 'express'
import {Prendas, Pedidos} from '../model/schemas'
import { db } from '../database/database'

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getPrends = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Prendas.aggregate([
                {
                    $lookup: {
                        from: 'pedidoxes',
                        localField: '_pedi',
                        foreignField: '_id',
                        as: "correspondiente"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getPedido = async (req:Request, res: Response) => {
        const { id } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Pedidos.aggregate([
                {
                    $lookup: {
                        from: 'prendaxes',
                        localField: '_id',
                        foreignField: '_pedi',
                        as: "pedidos"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private postPedido = async (req: Request, res: Response) => {
        const { id, precioBase, diasAprox, companie, fechaenvio, paissalida, estado, incremento, impuesto, material, volumen } = req.body
        await db.conectarBD()
        const dSchema={
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
        }
        const oSchema = new Pedidos(dSchema)
        await oSchema.save()
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private getPrenda = async (req:Request, res: Response) => {
        const { id } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const j = await Prendas.findOne({
                _id: id,
            })
            res.json(j)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private updatePedido = async (req: Request, res: Response) => {
        const {id} = req.params
        const {  precioBase, diasAprox, companie, fechaenvio, paissalida, estado, incremento, impuesto, material, volumen } = req.body
        await db.conectarBD()
        await Pedidos.findOneAndUpdate({
            _id: id,
        },{
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
        },{
            new: true, // para retornar el documento después de que se haya aplicado la modificación
            runValidators:true
        }
        )
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private deletePrenda = async (req: Request, res: Response) => {
        const { id } = req.params
        await db.conectarBD()
        await Prendas.findOneAndDelete(
                { _id: id }
            )
            .then( (doc: any) => {
                    if (doc == null) {
                        res.send(`No encontrado`)
                    }else {
                        res.send('Borrado correcto: '+ doc)
                    }
            })
            .catch( (err: any) => res.send('Error: '+ err)) 
        db.desconectarBD()
    }

    misRutas(){
        this._router.get('/prendap', this.getPrends),
        this._router.get('/prenda/:id', this.getPrenda),
        this._router.post('/pedido', this.postPedido), 
        this._router.get('/pedidop', this.getPedido),
        this._router.put('/ped/:id', this.updatePedido),
        this._router.delete('/deleteped/:id', this.deletePrenda)
    }

}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router