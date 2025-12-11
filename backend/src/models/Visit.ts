import mongoose, { Schema, Document } from 'mongoose'

export interface IVisit extends Document {
    visitedUserId: mongoose.Schema.Types.ObjectId
    viewerName: string
    viewerEmail: string | null
    createdAt: Date
}

const visitSchema = new Schema({
    visitedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    viewerName: {
        type: String,
        default: 'Anónimo'
    },
    viewerEmail: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Visit = mongoose.model<IVisit>('Visit', visitSchema)
export default Visit
