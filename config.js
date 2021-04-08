require('dotenv').config()

const requiredEnvs = ['JWT_SECRET','MOMGO_URI']
const missingEnvs = requiredEnvs.filter(envName => !process.env[envName])

if(missingEnvs.length){
    throw new Error(`missing env ${missingEnvs}`);
}

module.exports = {
saltRounds : process.env.SALT_ROUNDS || 7,
jwtSecret : process.env.JWT_SECRET,
mongoURI : process.env.MOMGO_URI,
port: process.env.PORT || 3000
    
}