const express = require('express')

const router = express.Router()

const axios = require('axios').default

const cheerio = require('cheerio')

const makeExcel = require('./xlsx/make_excel')

const editExcel = require('./xlsx/edit_excel')

router.get('/make', async (_, res) => {
    let blogData = { list: [] }

    const html = await axios.get('https://devmemory.tistory.com/')

    const $ = cheerio.load(html.data)

    const $articleList = $('div#mArticle').children('div.list_content')

    $articleList.each((_, e) => {
        const img = $(e).find('a.thumbnail_post img').attr('src')

        const title = $(e).find('a.link_post strong.tit_post').text()

        blogData.list = [...blogData.list, { img: `https:${img}`, title }]
    })

    blogData.callback = (fileName) => {
        res.download(fileName)
    }

    makeExcel(blogData)
})

router.get('/edit', async (_, res) => {
    const response = await editExcel()

    res.send({ response })
})

module.exports = router