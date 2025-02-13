const express = require('express');

const app = express();
const port = 7777;

app.use('/test', (req, res) => {
    res.send(`<h1 style="color: green;">Hello World!</h1>`);
})

app.use((req, res) => {
    res.send(`<h1 style="color: green;">Hello World!</h1>`);
})

app.listen(port, () =>{
    console.log("listening the server")
})