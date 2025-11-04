const express = require('express')

const Admin = require('../../models/Admin')
const Pegawai = require('../../models/Pegawai')
const Jabatan = require('../../models/Jabatan')
const { authAdmin } = require('../../middlewares/auth')
const { generateNomorPegawai } = require('../../middlewares/generate-nomor-pegawai')

const router = express.Router()

router.get('/', authAdmin, async (req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)
        const data = await Pegawai.getAll()

        res.render('admins/pegawai/index', {
            admin,
            data
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.get('/buat', authAdmin, async(req, res) => {
    try {
        const admin = await Admin.getNama(req.session.adminId)
        const jabatan = await Jabatan.getAll()

        res.render('admins/pegawai/create', {
            admin,
            jabatan,
            data: req.flash('data')[0]
        })
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/dashboard')
    }
})

router.post('/create', authAdmin, generateNomorPegawai, async (req, res) => {
    try {
        const { nama, id_jabatan } = req.body
        const { nomorPegawai } = req
        const data = { nama, nomor_pegawai: nomorPegawai }

        if (!nama) {
            req.flash('error', 'Nama wajib di isi')
            req.flash('data', data)
            return res.redirect('/admin/pegawai/buat')
        }

        if (!id_jabatan) {
            req.flash('error', 'Jabatan wajib di isi')
            req.flash('data', data)
            return res.redirect('/admin/pegawai/buat')
        }

        const result = await Pegawai.store(data)
        const idKaryawan = result.insertId
        
        if (id_jabatan) {
            const jabatanArray = Array.isArray(id_jabatan) ? id_jabatan : [id_jabatan]
            for (const id of jabatanArray) {
                await Jabatan.storePegawaiJabatan(idKaryawan, id)
            }
        }
        req.flash('success', 'Data pegawai berhasil ditambahkan')
        res.redirect('/admin/pegawai')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/pegawai')
    }
})

router.post('/update-status-account/:id', authAdmin, async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const { status_akun } = req.body
        const data = { status_akun }

        await Pegawai.updateStatusAccount(data, id)

        req.flash('success', 'Status akun pegawai berhasil diperbarui')
        res.redirect('/admin/pegawai')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/pegawai')
    }
})

router.post('/reset-password/:id', authAdmin, async (req, res) => {
    try {
        const { id } = req.params

        const status = await Pegawai.getById(id)
        if (status.status_akun != 'Aktif') {
            req.flash('error', 'Status Akun belum Aktif')
            return res.redirect('/admin/pegawai')
        }

        await Pegawai.resetPassoword(id)
        req.flash('success', `Password pegawai berhasil direset`)
        res.redirect('/admin/pegawai')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/pegawai')
    }
})

router.post('/delete/:id', authAdmin, async (req, res) => {
    try {
        const {id} = req.params

        const pegawai = await Pegawai.getById(id)
        if (pegawai.status_akun !=  'Non-Aktif') {
            req.flash('error', 'Ubah Status Akun manjad Non-Aktif untuk menghapsu Akun')
            return res.redirect('/admin/jabatan')
        }

        await Pegawai.delete(id)
        req.flash('success', 'Data pegawai berhasil dihapus')
        res.redirect('/admin/pegawai')
    } catch (err) {
        console.error(err)
        req.flash('error', 'Internal Server Error')
        res.redirect('/admin/pegawai')
    }
})

module.exports = router