module.exports = {
    index: (req, res) => {
        res.render('issuer/index', { title: 'Issuer' });
    },

    signup: (req, res) => {
        res.json({ message: 'success' });
    }

}
