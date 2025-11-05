import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user'
import usersRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import postRoutes from './routes/userPostRoutes';
import commentRoutes from './routes/userCommentRoutes';

dotenv.config();
const PORT = process.env.PORT;


const app = express();
app.use(express.json());


app.use('/api/user', userRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
