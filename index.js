const express = require('express')
const app = express()

// Set PORT
app.set('port', 4040)

app.get('/', (req, res) => {
    res.send("Welcome to SkillStead API")
})

app.listen(app.get('port'), function(){
    console.log("Server is running on " + app.get('port'));
});