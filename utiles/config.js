require("dotenv").config();

const MONGOOSE_URL = process.env.MONGOOSE;
const PORT = process.env.PORT;
const JWTPASS = process.env.JWTPASS;
const EMAIL_PASS=process.env.EMAIL_PASS

module.exports={
    MONGOOSE_URL,
    PORT,
    JWTPASS,
    EMAIL_PASS
}