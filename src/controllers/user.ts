import prisma from '../db';
import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
        const existEmail = await prisma.user.findFirst({
            where: { email },
        });

        if (existEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = await prisma.user.create({
            data: { name, email },
        });

        res.status(201).json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
