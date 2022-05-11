const axios = require('axios').default

const cheerio = require('cheerio')

module.exports = async () => {
    let list = []

    const html = await axios.get('https://devmemory.tistory.com/')

    const $ = cheerio.load(html.data)

    const $articleList = $('div#mArticle').children('div.list_content')

    $articleList.each((_, e) => {
        const img = $(e).find('a.thumbnail_post img').attr('src')

        const title = $(e).find('a.link_post strong.tit_post').text()

        list = [...list, { img: `https:${img}`, title }]
    })

    return list
}