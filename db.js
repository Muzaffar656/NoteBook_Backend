const mongoose = require('mongoose')
const MONGOOSEURI = process.env.MONGOOSEURI
const MongooseConnect = ()=>{
    mongoose.connect(MONGOOSEURI).then(()=>{  console.log('connected succesfully')}).catch((e)=>{console.log(e)})
}

module.exports = MongooseConnect