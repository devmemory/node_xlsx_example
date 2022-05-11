const axios = require('axios').default

const fs = require('fs')

const sizeUtil = require('image-size')

const xlsx = require('xlsx')

module.exports = async () => {
    const excelFile = xlsx.readFile(handler.getExcelFilePath)

    const sheetName = excelFile.SheetNames[0]

    const sheet = excelFile.Sheets[sheetName]

    const jsonData = xlsx.utils.sheet_to_json(sheet)

    let imgSizeList = []

    for (let i = 0; i < jsonData.length; i++) {
        const imageData = await handler.downloadImage(jsonData[i].img)

        const imgSize = handler.getImageSize(imageData.filePath)

        imgSizeList = [...imgSizeList, [imgSize.width, imgSize.height]]
    }
    xlsx.utils.sheet_add_aoa(sheet, imgSizeList, { origin: 'C2' })

    try {
        xlsx.writeFile(excelFile, handler.getExcelFilePath)
    } catch (e) {
        return { result: e }
    }

    return { result: 'Done' }
}

const handler = {
    downloadImage: async (url) => {
        const urlString = url.split('/')

        const filePath = `image/${urlString[urlString.length - 2]}-${urlString[urlString.length - 1]}`

        // 파일이 있는지 체크 없으면 다운로드
        if (fs.existsSync(filePath)) {
            console.log(`[image] existing path : ${filePath}`)
            return { filePath, msg: 'already exist', code: -1 }
        }

        const res = await axios.get(url, { responseType: 'stream' })

        const writeStream = fs.createWriteStream(filePath)

        res.data.pipe(writeStream)

        // 다운로드 완료 blocking용 콜백
        async function isFinished() {
            return new Promise((res, rej) => {
                writeStream.on('finish', () => {
                    console.log(`[image] download path : ${filePath}`)
                    res('finished')
                })
                writeStream.on('error', rej)
            })
        }

        await isFinished()

        return { filePath, msg: 'downloaded', code: 1 }
    },
    getExcelFilePath: 'test.xls',
    getImageSize: (filePath) => {
        let dimensions
        try {
            dimensions = sizeUtil(filePath)
        } catch (e) {
            console.log({ e })
            dimensions = { width: 'N/A', height: 'N/A' }
        }

        return {
            width: dimensions.width,
            height: dimensions.height
        }
    }
}