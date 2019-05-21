// 初始設置
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const dbpath = process.env.MONGODB_URI || 'mongodb://127.0.0.1/url-shortener'

// 載入套件
const mongoose = require('mongoose')
const path = require('path')
const pug = require('pug')
const bodyParser = require('body-parser')

// 連線到 mongodb 並取得資料庫物件
mongoose.connect(dbpath, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

// 設置樣板
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// 設置靜態檔案路徑
app.use(express.static(path.join(__dirname, 'public')))

// 使用 body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// 首頁
app.get('/', (req, res) => {
  res.render('index')
})
// 產生短網址
app.post('/', (req, res) => {

})
// 顯示短網址頁面
app.get('/:id', (req, res) => {

})

// 監聽 port
app.listen(port, () => {
  console.log(`App is running on port ${port} now.`)
})