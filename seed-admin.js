require('dotenv').config()
const connection = require('./configs/database')
const bcrypt = require('bcryptjs')

async function seedAdmin() {
    try {
        const [rows] = await connection.query(`SELECT id FROM admin WHERE nomor_admin = ?`, [ process.env.NOMOR_ADMIN ])
        if (rows.length > 0) {
            console.log('Admin sudah ditambahkan sebelumnya.')
        } else {
            const hashedPassword = await bcrypt.hash(process.env.KATA_SANDI_ADMIN, 10)
            await connection.query(`INSERT INTO admin (nama, nomor_admin, kata_sandi) VALUES (?, ?, ?)`, [ process.env.NAMA_ADMIN, process.env.NOMOR_ADMIN, hashedPassword ])
        }
    } catch (err) {
        console.error(err)
    } finally {
        process.exit()
    }
}

seedAdmin()