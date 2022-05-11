const express = require('express')

const app = express()

const port = process.env.PORT || 8080

const excel = require('./excel/index')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// api 목록
// excel/make : scraping 및 엑셀로 만들기
// excel/edit : 이미지 다운로드 및 엑셀 편집
app.use('/excel', excel)

app.listen(port, () => {
    console.log(`Started! express server on port ${port}`)
})