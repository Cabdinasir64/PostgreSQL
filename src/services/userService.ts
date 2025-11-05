import prisma from '../db';
import { Users } from '@prisma/client';

export async function getAllUsers(): Promise<Users[]> {
    return prisma.users.findMany({
        include: { roles: { include: { role: true } }, posts: true, UserComment: true },
    });
}

export async function getUserById(id: number): Promise<Users | null> {
    return prisma.users.findUnique({
        where: { id },
        include: { roles: { include: { role: true } }, posts: true, UserComment: true },
    });
}

export async function createUser(data: { username: string; email: string; password: string }): Promise<Users> {
    return prisma.users.create({ data });
}

export async function updateUser(id: number, data: Partial<{ username: string; email: string; password: string }>): Promise<Users | null> {
    try {
        const updated = await prisma.users.update({ where: { id }, data });
        return updated;
    } catch (error: any) {
        if (error.code === 'P2025') return null;
        throw error;
    }

}

export async function deleteUser(id: number): Promise<boolean> {
    const deleted = await prisma.users.deleteMany({
        where: { id }
    });
    return deleted.count > 0;
}