import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user'

dotenv.config();
const PORT = process.env.PORT;


const app = express();
app.use(express.json());


app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
