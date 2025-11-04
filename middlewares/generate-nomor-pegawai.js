const Pegawai = require('../models/Pegawai')

async function generateNomorPegawai(req, res, next) {
    const tahun = new Date().getFullYear()

    const lastId = await Pegawai.getLastId()
    console.log(lastId)
    const id = lastId + 1

    req.nomorPegawai = `${tahun}-${String(id).padStart(3, '0')}`

    next()
}
module.exports = { generateNomorPegawai }