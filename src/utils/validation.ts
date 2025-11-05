import prisma from '../db';

const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;


const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

export async function validateUsername(username: string): Promise<string | null> {
    if (!username) return 'Username is required.';
    if (!usernamePattern.test(username)) return 'Username must start with a letter, have no spaces or special characters, and be 3-30 chars.';

    const existing = await prisma.users.findUnique({ where: { username } });
    if (existing) return 'Username is already taken.';
    return null;
}

export async function validateEmail(email: string): Promise<string | null> {
    if (!email) return 'Email is required.';
    if (!emailPattern.test(email)) return 'Email is invalid.';

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) return 'Email is already in use.';
    return null;
}

export function validatePassword(password: string): string | null {
    if (!password) return 'Password is required.';
    if (!passwordPattern.test(password)) return 'Password must be at least 6 chars, with uppercase, lowercase, number, and special character.';
    return null;
}
