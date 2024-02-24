const fs = require('fs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../.env' })

// Convert image to base64 string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return bitmap.toString('base64');
}

//GENERATE JWT WITH SPECIFIED ID
function generateJWT(id) {
    return jwt.sign(id, process.env.SECRET, {expiresIn: '86400s'})
}
//CHECKING IF A JWT IS VALID
function checkToken(req, res, next) {
    if (typeof req.cookies.JWT !== 'undefined' && typeof req.cookies.user !== 'undefined') {
        const token = req.cookies.JWT
        const username = req.cookies.user
        //OTHERWISE, CHECK IF THE TOKEN IS VALID
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            //IF JWT IS NOT VALID, RETURN 403
            if (err || decoded.username !== username) return res.sendStatus(403)
            //OTHERWISE CALL next() TO INDICATE APP TO CONTINUE
            next()
        })
    }
    else
        res.sendStatus(403)
}

function checkAdmin(req, res, next) {
    console.log(req.cookies.JWT)
    if ( !req.cookies.isAdmin) res.sendStatus(403)
    next()
}


module.exports = { base64_encode, generateJWT, checkToken, checkAdmin}