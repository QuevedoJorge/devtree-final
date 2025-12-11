import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import User from './models/User'
import Visit from './models/Visit'
import { connectDB } from './config/db'

dotenv.config()

const cleanDb = async () => {
    await connectDB()

    try {
        console.log(colors.yellow('Eliminando historial de visitas...'))
        await Visit.deleteMany({})
        console.log(colors.green('Visitas eliminadas.'))

        console.log(colors.yellow('Reiniciando contadores de usuarios...'))
        await User.updateMany({}, { $set: { visitas: 0 } })
        console.log(colors.green('Contadores reiniciados.'))
        
        console.log(colors.cyan.bold('Limpieza finalizada con éxito.'))
        process.exit(0)
    } catch (error) {
        console.log(colors.red('Hubo un error al limpiar la base de datos'))
        console.log(error)
        process.exit(1)
    }
}

cleanDb()
