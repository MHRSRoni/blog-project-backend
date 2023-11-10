const mongoose = require('mongoose')

const ConnectDB = async () => {
    try {
        mongoose.connect(process.env.DB_URI);
        console.log('✅ Database has been Connected!😊')
    } catch (error) {
        console.log('❌ Database has been not Connected!')

    }
}

module.exports = ConnectDB;