import prisma from '../db';

export async function getAllPosts() {
    return prisma.userPost.findMany({
        include: { author: true, comments: true },
    });
}

export async function getPostById(id: number) {
    return prisma.userPost.findUnique({
        where: { id },
        include: { author: true, comments: true },
    });
}

export async function createPost(data: { title: string; content?: string; authorId: number }) {
    return prisma.userPost.create({ data });
}

export async function updatePost(id: number, data: { title?: string; content?: string }) {
    return prisma.userPost.update({
        where: { id },
        data,
    });
}

export async function deletePost(id: number) {
    return prisma.userPost.delete({ where: { id } });
}
