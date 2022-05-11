const xlsx = require('xlsx')

module.exports = (data) => {
    const workBook = xlsx.utils.book_new()

    const sheetData = xlsx.utils.json_to_sheet(data.list)

    const sheetName = '데이터'

    // sheet에 추가
    xlsx.utils.book_append_sheet(workBook, sheetData, sheetName)

    const excelFileName = 'test.xls'

    // excel 파일 생성
    xlsx.writeFileAsync(excelFileName, workBook, null, () => {
        console.log('Finished writing')
        data.callback(excelFileName)
    })
}