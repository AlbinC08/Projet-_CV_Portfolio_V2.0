import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    
    mail: {
        type: String,
        required: [true, "pas de mail"]
    },
    password: {
        type: String,
        required: [true, "pas de mot de passe"]
    }
})

const UserModel = mongoose.model('Users', userSchema)
export default UserModel