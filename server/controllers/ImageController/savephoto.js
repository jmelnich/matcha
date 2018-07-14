const multer = require('multer');

module.exports = (req, res) => {
    let save     = req.app.get('save'),
        response = multer(save.image).single('photo'),
        db       = req.app.get('db');

    res.send('Photo saved');
    response(req, res, (err) => {
        if (err) {
            res.send(err);
        } else if (req.file) {
            let {filename} = req.file,
                promise    = db.create('photos', 'user_id, filename', [req.session.id, filename]);
            promise.then(res => res.send('Photo saved')).catch(e => console.log(e));
        }
    })
};