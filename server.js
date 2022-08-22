import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import projectModel from './models/project.js';
import session from "express-session";
import { createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";
import 'dotenv/config';
import authGuard from './authGuard.js';

const users = JSON.parse(process.env['USER_ADMIN']);
const db = process.env.BDD_URL
const app = express()
const router = express.Router()
app.use(session({secret: process.env.SECRET, saveUninitialized: true,resave: true}));
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./assets'))
app.use(router)


/****** node mailer *********/

router.post('/', async (req, res) => {
    console.log(req.body);

    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.PASSWORD
        }
    })

    const mailOptions = {
        from: req.body.email,
        to: process.env.GMAIL_USER,
        subject: `Message from ${req.body.email}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if (error) {
            console.log(error);
            res.send('error')
        }else{
            console.log('Email sent: '+info.res);
            res.redirect('/#form-contact')
        }
    })

   });  





const storage = multer.diskStorage({
    // destination pour le fichier
    destination: function (req, file, callback) {
        callback(null, './assets/uploads/images')
    },
    //ajouter le retour de l'extension
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)//date d'aujourd'hui concaténé au nom de l'image
    },
})

/****** upload parametre pour multer *********/

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
})

mongoose.connect(db, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("connected to database mongodb (c'est dur....)");
    }
})

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('conected at 3000');
    }
})

/******** Page Home *********/

app.get("/", async (req, res) => {
    let projects = await projectModel.find()
    res.render("./main.twig",{
        projects: projects
    })
})

/********* Page Login *********/

app.get("/login", async (req, res) => {
    res.render("./login.twig")
})

app.post("/login", async (req, res) => {
    if (req.body.username == users.USER_MAIL && req.body.password == users.USER_PASSWORD) {
        req.session.connected = true
        res.redirect('/addProject')
    } else {
        res.redirect("/login")

    }
})

/********* Page Ajout Projet *********/

app.get("/addProject", authGuard, async (req, res) => {
    let errors = req.session.error
    req.session.error = ""
    res.render("./addProject.twig",{
        errors: errors
    })
})

app.post("/addProject", authGuard, upload.single('image'), async (req, res) => {
    try {
        if (req.file) {
            req.body.img = req.file.filename
        }
        let project = new projectModel(req.body)
        const error = project.validateSync();
        if (error) {
            throw(error)
        }
        project.save()
        res.redirect('/') 
    } catch (error) {
        req.session.error = Object.values(error.errors);
        res.redirect('/addProject')
    }
  
})


