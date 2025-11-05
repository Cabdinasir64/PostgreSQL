import prisma from '../db';
import { Role } from '@prisma/client';

export async function getAllRoles(): Promise<Role[]> {
    return prisma.role.findMany({
        include: { users: { include: { user: true } } }
    });
}

export async function getRoleById(id: number): Promise<Role | null> {
    return prisma.role.findUnique({
        where: { id },
        include: { users: { include: { user: true } } }
    });
}

export async function createRole(name: string): Promise<Role> {
    return prisma.role.create({ data: { name } });
}

export async function updateRole(id: number, name: string): Promise<Role | null> {
    try {
        return prisma.role.update({ where: { id }, data: { name } });
    } catch {
        return null;
    }
}

export async function deleteRole(id: number): Promise<Role | null> {
    try {
        return prisma.role.delete({ where: { id } });
    } catch {
        return null;
    }
}

export async function assignRoleToUser(userId: number, roleId: number) {
    return prisma.userRole.create({
        data: {
            userId,
            roleId
        }
    });
}

export async function removeRoleFromUser(userId: number, roleId: number) {
    return prisma.userRole.delete({
        where: {
            userId_roleId: { userId, roleId }
        }
    });
}
