const express = require('express')

const router = express.Router()

const makeExcel = require('./xlsx/make_excel')

const editExcel = require('./xlsx/edit_excel')

const scrap = require('../scrap/index')

router.get('/make', async (_, res) => {
    let blogData = {}

    blogData.list = await scrap()

    blogData.callback = (fileName) => {
        res.download(fileName)
    }

    makeExcel(blogData)
})

router.get('/edit', async (_, res) => {
    await editExcel((fileName) => res.download(fileName))
})

module.exports = router