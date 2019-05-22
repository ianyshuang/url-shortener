// 初始設置
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const dbpath = process.env.MONGODB_URI || 'mongodb://127.0.0.1/url-shortener'

// 載入套件及函式
const mongoose = require('mongoose')
const path = require('path')
const pug = require('pug')
const bodyParser = require('body-parser')

// 載入 model
const Url = require('./models/url')

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
app.post('/', async (req, res) => {
  // 讀入使用者輸入的網址
  const newUrl = req.body.url
  // 尋找此網址是否已經生成過
  const url = await Url.findOne({ original: newUrl }).exec()
  // 若沒有則新增
  if (url === null) {
    let randomUrl = ''
    // 若新產生的短網址以重複則一直產生到沒有重複為止
    while (true) {
      randomUrl = Math.random().toString(36).slice(-5)
      const duplicate = await Url.findOne({ shortened: randomUrl }).exec()
      if (duplicate === null) break
    }
    // 新增這個網址的資料並回傳
    Url.create({
      original: newUrl,
      shortened: randomUrl
    })
      .then(url => res.render('show', { url }))
      .catch(err => res.status(422).json(err))
  } else {
    // 若已經生成過則回傳
    res.render('show', { url })
  }
})
// 顯示短網址頁面
app.get('/:shortenedUrl', (req, res) => {
  // 查找短網址的原網址
  Url.findOne({ shortened: req.params.shortenedUrl }).exec()
    // 導向原網址
    .then(url => res.redirect(`${url.original}`))
    .catch(err => res.status(422).json(err))
})

// 監聽 port
app.listen(port, () => {
  console.log(`App is running on port ${port} now.`)
})

