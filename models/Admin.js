const connection = require('../configs/database')
const bcrypt = require('bcryptjs')

class Admin {
    static async login(data) {
        try {
            const [rows] = await connection.query(`select * from admin where nomor_admin = ? `, [data.nomor_admin])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async getNama(id) {
        try {
            const [rows] = await connection.query(`select nama from admin where id = ? `, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async getById(id) {
        try {
            const [rows] = await connection.query(`select * from admin where id = ? `, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async changePassword(id, data) {
        try {
            const hashedPassword = await bcrypt.hash(data.kata_sandi_baru, 10)
            await connection.query(`update admin set kata_sandi = ? where id = ? `, [hashedPassword, id])
        } catch (err) {
            throw err
        }
    }
}

module.exports = Admin