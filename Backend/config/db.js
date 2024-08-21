const {connect} = require('mongoose')

const connectToDb = async(uri)=>{

    await connect(uri)
}

module.exports = connectToDb