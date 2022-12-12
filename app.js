require('dotenv').config();
require('express-async-errors');

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xssclean = require('xss-clean')
const ratelimit = require('express-rate-limit')



const express = require('express');
const app = express();

const  connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication');
// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1)
app.use(ratelimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	// standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	// legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xssclean())

app.get('/',(req,res)=>{
  res.send('welcome to my jobs api')
})


 

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

 
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => { 
  try {
       await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error); 
  }
};

start();
