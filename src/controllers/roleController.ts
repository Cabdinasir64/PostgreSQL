import { Request, Response } from 'express';
import * as roleService from '../services/roleService';
import prisma from '../db';

export async function getRoles(req: Request, res: Response) {
    try {
        const roles = await roleService.getAllRoles();

        res.json({ success: true, data: roles });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function getRole(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const role = await roleService.getRoleById(id);

        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

        res.json({ success: true, data: role });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function createRole(req: Request, res: Response) {
    try {
        const { name } = req.body;

        if (!name) return res.status(400).json({ success: false, message: 'Role name is required' });

        const existing = await prisma.role.findUnique({ where: { name } });
        if (existing) return res.status(400).json({ success: false, message: 'Role already exists' });

        const role = await roleService.createRole(name);
        res.status(201).json({ success: true, message: 'Role created successfully', data: role });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function updateRole(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;

        if (!name) return res.status(400).json({ success: false, message: 'Role name is required' });

        const existing = await prisma.role.findUnique({ where: { name } });
        if (existing) return res.status(400).json({ success: false, message: 'Role name already in use' });

        const role = await roleService.updateRole(id, name);
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

        res.json({ success: true, message: 'Role updated successfully', data: role });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function deleteRole(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const deleted = await roleService.deleteRole(id);

        if (!deleted) return res.status(404).json({ success: false, message: 'Role not found' });

        res.json({ success: true, message: 'Role deleted successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function assignRole(req: Request, res: Response) {
    try {
        const { userId, roleId } = req.body;
        if (!userId || !roleId) return res.status(400).json({ success: false, message: 'userId and roleId are required' });

        const user = await prisma.users.findUnique({ where: { id: Number(userId) } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const role = await prisma.role.findUnique({ where: { id: Number(roleId) } });
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

        const existing = await prisma.userRole.findUnique({ where: { userId_roleId: { userId, roleId } } });
        if (existing) return res.status(400).json({ success: false, message: 'Role already assigned to user' });

        const assignment = await roleService.assignRoleToUser(Number(userId), Number(roleId));
        res.json({ success: true, message: 'Role assigned to user', data: assignment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function removeRole(req: Request, res: Response) {
    try {
        const { userId, roleId } = req.body;
        if (!userId || !roleId) return res.status(400).json({ success: false, message: 'userId and roleId are required' });

        const user = await prisma.users.findUnique({ where: { id: Number(userId) } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const role = await prisma.role.findUnique({ where: { id: Number(roleId) } });
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

        const existing = await prisma.userRole.findUnique({ where: { userId_roleId: { userId, roleId } } });
        if (!existing) return res.status(400).json({ success: false, message: 'Role not assigned to user' });

        const removed = await roleService.removeRoleFromUser(Number(userId), Number(roleId));
        res.json({ success: true, message: 'Role removed from user', data: removed });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

