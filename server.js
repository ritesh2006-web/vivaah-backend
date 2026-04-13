import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import guestRoutes from './routes/guestRoutes.js';
import taskRoutes from "./routes/taskRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";

dotenv.config();
const PORT = 5000;

const app = express();

app.use(cors({
  origin: "https://vivaah-indol.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/vendors',vendorRoutes);
app.use('/api/bookings',bookingRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/venues", venueRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

