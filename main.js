/* NPM */
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { body, validationResult, check } = require('express-validator')

/* Module */
const db = require('./utils/db') // DB
const Contact = require('./model/contact')

const app = express()
const port = 2077

//Use EJS
app.set('view engine', 'ejs')

//Third-party Middelware
app.use(expressLayouts)

//Build-In Middelware
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

/* HOME */
app.get('/', (req, res) => {
  const Mahasiswa = [
    {
      nama: "Rhaul Ken",
      email: "rahul@user.com"
    },
    {
      nama: "jajang",
      email: "jajang@user.com"
    },
    {
      nama: "Guest",
      email: "guest@user.com"
    },
  ]

  res.render('index', {
    layout: 'layouts/main-layout',
    title: 'Home',
    mahasiswa: Mahasiswa
  })
})
/* HOME */

/* ABOUT */
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'About'
  })
})
/* ABOUT */

/* CONTACT */
app.get('/contact', async (req, res) => {
  const contacts = await Contact.find().sort({nama: 1});

  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Contact',
    contacts
  })
})

//Halaman Tambah Kontak
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    layout: 'layouts/main-layout',
    title: 'Tambah Data Contact'
  })
})

//Proses Tambah Kontak
app.post('/contact',
[
  body('nama').custom(async (value) => {
    const duplicate = await Contact.findOne({nama: { $regex: new RegExp(value, 'i') }})
    
    if (duplicate) {
      throw new Error('Nama sudah pernah digunakan.')
    }
    return true;
  }),
  check('email', 'Email tidak valid.').isEmail(),
  check('noHP', 'No. HP tidak valid.').isMobilePhone('id-ID')
], 
async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Tambah Data Contact',
        errors: err.array()
      })
    }else{
      await Contact.insertMany(req.body)
      .then(() =>  res.send('<script>alert(`Data Berhasil Ditambahkan.`); location.href=`/contact`;</script>'))
      .catch((err) => new Error(err))
    }
})

//Proses Hapus Kontak
app.get('/contact/delete/:nama', async (req, res) => {
  const contact = await Contact.findOne({nama: req.params.nama})
  
  if (!contact) {
    res.status(404)
    res.send('<h1>404 | Data Tidak Ditemukan.</h1>')
  }else{
    await Contact.deleteOne({nama: req.params.nama})
    .then(() =>  res.send('<script>alert(`Data Berhasil Dihapus.`); location.href=`/contact`;</script>'))
    .catch((err) => new Error(err))
  }
})

//Halaman Ubah Kontak
app.get('/contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({nama: req.params.nama})

  res.render('edit-contact', {
    layout: 'layouts/main-layout',
    title: 'Ubah Data Contact',
    contact
  })
})

//Proses Ubah Kontak
app.post('/contact/update/:nama',
[
  body('nama').custom(async (value, {req}) => {
    const duplicate = await Contact.findOne({nama: { $regex: new RegExp(value, 'i') }})

    if (value.toLowerCase() !== req.body.old_nama.toLowerCase() && duplicate) {
      throw new Error('Nama sudah pernah digunakan.')
    }
    return true
  }),
  check('email', 'Email tidak valid.').isEmail(),
  check('noHP', 'No. HP tidak valid.').isMobilePhone('id-ID')
], 
async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const contact = await Contact.findOne({nama: req.params.nama})

      res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: 'Ubah Data Contact',
        errors: err.array(),
        contact
      })
    }else{
      await Contact.updateOne(
        {nama: req.params.nama},
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            noHP: req.body.noHP,
          }
        }
      )
      .then(() => res.send('<script>alert(`Data Berhasil Diubah.`); location.href=`/contact`;</script>'))
      .catch((err) => new Error(err))
    }
})

//Halaman Detail Kontak
app.get('/contact/:nama', async (req, res) => {
  const contact = await Contact.findOne({nama: req.params.nama});

  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Detail Contact',
    contact
  })
})
/* CONTACT */

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>404 | Not Found</h1>')
})

app.listen(port, () => {
  console.log(`Contact-app-mongo-express listening on http://localhost:${port}`)
})