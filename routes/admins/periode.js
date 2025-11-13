const express = require('express')

const Admin = require('../../models/Admin')
const Pegawai = require('../../models/Pegawai')
const { authAdmin } = require('../../middlewares/auth')

const router = express.Router()

module.exports = router