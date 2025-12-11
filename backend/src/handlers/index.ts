import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug'
import formidable from 'formidable'
import { v4 as uuid } from 'uuid'
import User from "../models/User"
import Visit from '../models/Visit'
import jwt from 'jsonwebtoken'

import { checkPassword, hashPassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'
import cloudinary from '../config/cloudinary'

export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('Un usuario con ese mail ya esta registrado')
        return res.status(409).json({ error: error.message })
    }

    const handle = slug(req.body.handle, '')
    const handleExists = await User.findOne({ handle })
    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible')
        return res.status(409).json({ error: error.message })
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle

    await user.save()
    res.status(201).send('Registro Creado Correctamente')
}

export const login = async (req: Request, res: Response) => {

    // Manejar errores
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Revisar si el usuario esta registrado
    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error('El Usuario no existe')
        return res.status(404).json({ error: error.message })
    }

    // Comprobar el password
    const isPasswordCorrect = await checkPassword(password, user.password)
    if (!isPasswordCorrect) {
        const error = new Error('Password Incorrecto')
        return res.status(401).json({ error: error.message })
    }

    const token = generateJWT({ id: user._id })

    res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body

        const handle = slug(req.body.handle, '')
        const handleExists = await User.findOne({ handle })
        if (handleExists && handleExists.email !== req.user.email) {
            const error = new Error('Nombre de usuario no disponible')
            return res.status(409).json({ error: error.message })
        }

        // Actualizar el usuario
        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        await req.user.save()
        res.send('Perfil Actualizado Correctamente')

    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false })
    try {
        form.parse(req, (error, fields, files) => {
            cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
                if (error) {
                    const error = new Error('Hubo un error al subir la imagen')
                    return res.status(500).json({ error: error.message })
                }
                if (result) {
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({ image: result.secure_url })
                }
            })
        })
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params
        const user = await User.findOne({ handle }).select('-_id -__v -email -password')
        if (!user) {
            const error = new Error('El Usuario no existe')
            return res.status(404).json({ error: error.message })
        }
        res.json(user)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body
        const userExists = await User.findOne({handle})
        if(userExists) {
            const error = new Error(`${handle} ya está registrado`)
            return res.status(409).json({error: error.message})
        }
        res.send(`${handle} está disponible`)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password -__v')
        if (!user) {
            const error = new Error('El Usuario no existe')
            return res.status(404).json({ error: error.message })
        }
        res.json(user)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const registerVisit = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params

        const user = await User.findById(userId)
        if (!user) {
            const error = new Error('El Usuario no existe')
            return res.status(404).json({ error: error.message })
        }

        let viewerName = 'Anónimo'
        let viewerEmail = null

        const bearer = req.headers.authorization
        if (bearer) {
            const [, token] = bearer.split(' ')
            if (token) {
                try {
                    const result = jwt.verify(token, process.env.JWT_SECRET)
                    if (typeof result === 'object' && result.id) {
                        const visitor = await User.findById(result.id)
                        if (visitor) {
                            viewerName = visitor.name
                            viewerEmail = visitor.email

                            // Verificar si ya existe una visita de este usuario (viewerEmail) al perfil (userId)
                            const existingVisit = await Visit.findOne({ visitedUserId: userId, viewerEmail })
                            if (existingVisit) {
                                return res.json({ msg: 'Visita ya registrada previamente' })
                            }
                        }
                    }
                } catch (e) {
                    // ignore
                }
            }
        }

        user.visitas += 1
        await user.save()

        const visit = new Visit({
            visitedUserId: userId,
            viewerName,
            viewerEmail
        })
        await visit.save()

        res.json({ msg: 'Visita registrada' })
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const getVisits = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const visits = await Visit.find({ visitedUserId: userId }).select('viewerName viewerEmail createdAt')
        res.json(visits)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}

export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { query } = req.query
        if (!query) return res.json([])

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('name email image')

        res.json(users)
    } catch (e) {
        const error = new Error('Hubo un error')
        return res.status(500).json({ error: error.message })
    }
}