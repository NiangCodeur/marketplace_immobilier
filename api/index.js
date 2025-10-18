import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
dotenv.config()


// mongoose.connect(process.env.MONGO).then(() => {
//     console.log('Connected to MongoDB')
// }).catch((err) => {
//     console.log(err)
// })

// const app = express()

// app.use(express.json())

// app.use("/api/user", userRouter)
// app.use("/api/auth", authRouter)

// app.listen(3000, () => {
//     console.log('Server is running on port 3000') 
// }
// )

mongoose.set('strictQuery', false)

const app = express()
app.use(express.json())
app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
 
const start = async () => {
    try {
        if (!process.env.MONGO) throw new Error('MONGO env variable is not set')
        // option serverSelectionTimeoutMS raccourcit le délai de détection d'erreur
        await mongoose.connect(process.env.MONGO, { serverSelectionTimeoutMS: 5000 })
        console.log('Connected to MongoDB')
        app.listen(3000, () => {
            console.log('Server is running on port 3000')
        })
    } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
    }
}

start()

// create a middleware and a function to handle possible errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500 
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

