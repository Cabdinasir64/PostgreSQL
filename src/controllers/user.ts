import prisma from '../db';
import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
        const existEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = await prisma.user.create({
            data: { name, email },
        });

        res.status(201).json({
            message: 'User created successfully',
            user
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email) {
            const emailExists = await prisma.user.findUnique({
                where: {
                    email,
                    AND: { id: Number(id) }
                }
            });

            if (emailExists) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name: name ?? user.name,
                email: email ?? user.email
            },
        });

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await prisma.user.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({
            message: 'User deleted successfully',
            user
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const searchUser = async (req: Request, res: Response) => {
    const { name } = req.query;

    try {
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Please provide a valid name to search' });
        }

        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            }
        });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({
            message: 'Users found successfully',
            users
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const filterUsers = async (req: Request, res: Response) => {
    const { name, email, sort } = req.query;

    try {
        const filters: any = {};

        if (name && typeof name === 'string') {
            filters.name = {
                contains: name,
                mode: 'insensitive'
            };
        }

        if (email && typeof email === 'string') {
            filters.email = {
                contains: email,
                mode: 'insensitive'
            };
        }

        let orderByOption = {};
        if (sort && typeof sort === 'string') {
            const direction = sort.toLowerCase() === 'asc' ? 'asc' : 'desc';
            orderByOption = { createdAt: direction };
        } else {
            orderByOption = { createdAt: 'desc' };
        }

        const users = await prisma.user.findMany({
            where: filters,
            orderBy: orderByOption
        });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({
            message: 'Filtered users retrieved successfully',
            total: users.length,
            users
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const countUsers = async (req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();
        res.status(200).json({
            message: 'Total users counted successfully',
            totalUsers
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getUsersPaginated = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 2;

    const skip = (page - 1) * pageSize;

    try {
        const totalUsers = await prisma.user.count();

        const users = await prisma.user.findMany({
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
        });

        const totalPages = Math.ceil(totalUsers / pageSize);

        const pagination = {
            currentPage: page,
            pageSize,
            totalPages,
            totalUsers,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        };

        res.status(200).json({
            message: 'Paginated users retrieved successfully',
            pagination,
            users
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getUsersStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();

        const latestUser = await prisma.user.findFirst({
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({
            message: 'Users statistics retrieved successfully',
            totalUsers,
            latestUser,
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getUsersByMonth = async (req: Request, res: Response) => {
    try {
        const usersPerMonth = await prisma.$queryRaw<{ month: string; count: bigint }[]>
            `SELECT to_char("createdAt", 'Month') AS month, COUNT(*) AS count
            FROM "user"
            GROUP BY month
            ORDER BY MIN("createdAt") DESC;`;

        const usersPerMonthJSON = usersPerMonth.map(u => ({
            month: u.month.trim(),
            count: Number(u.count)
        }));

        res.status(200).json({
            message: 'Users grouped by month successfully',
            usersPerMonth: usersPerMonthJSON
        });

    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
