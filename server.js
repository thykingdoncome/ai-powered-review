const express = require('express')

const app = express()

app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + "/public"))

const port = process.env.PORT || 8080

// set the home page route
app.get("/", function (req, res) {
  res.render("index")
})

app.listen(port, () => {
  console.log(`listening on ${port}`)
})