import { Request, Response } from 'express';
import * as userService from '../services/userService';
import bcrypt from 'bcrypt';
import { validateUsername, validateEmail, validatePassword } from '../utils/validation';

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await userService.getAllUsers();

        res.json(users);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const user = await userService.getUserById(id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export async function createUser(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;

        const usernameError = await validateUsername(username);
        if (usernameError) return res.status(400).json({ message: usernameError });

        const emailError = await validateEmail(email);
        if (emailError) return res.status(400).json({ message: emailError });

        const passwordError = validatePassword(password);
        if (passwordError) return res.status(400).json({ message: passwordError });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userService.createUser({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: "Successful create user", user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { username, email, password } = req.body;

        if (username) {
            const usernameError = await validateUsername(username);
            if (usernameError) return res.status(400).json({ message: usernameError });
        }

        if (email) {
            const emailError = await validateEmail(email);
            if (emailError) return res.status(400).json({ message: emailError });
        }

        let hashedPassword;
        if (password) {
            const passwordError = validatePassword(password);
            if (passwordError) return res.status(400).json({ message: passwordError });
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await userService.updateUser(id, {
            username,
            email,
            password: hashedPassword,
        });

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        const deletedUser = await userService.deleteUser(id);

        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
