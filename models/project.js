import mongoose from 'mongoose'

/******** SCHEMA A RESPECTER POUR CREER UN PROJET **********/


const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "pas de titre"]
    },
    description: {
        type: String,
        required: [true, "Pas de description"]
    },
    link: {
        type: String,
        required: [true, "pas de link"]
    },
    project_link: {
        type: String,
        required: [true, "pas de project_link"]
    },
    img: {
        type:String,
        required: [true, "pas d'images"]
}
})

const projectModel = mongoose.model('project', projectSchema)
export default projectModel