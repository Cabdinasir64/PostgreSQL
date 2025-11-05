import prisma from '../db';

export async function getAllComments() {
    return prisma.userComment.findMany({
        include: { author: true, post: true },
    });
}

export async function getCommentById(id: number) {
    return prisma.userComment.findUnique({
        where: { id },
        include: { author: true, post: true },
    });
}

export async function createComment(data: { text: string; postId: number; authorId: number }) {
    return prisma.userComment.create({ data });
}

export async function updateComment(id: number, text: string) {
    return prisma.userComment.update({
        where: { id },
        data: { text },
    });
}

export async function deleteComment(id: number) {
    return prisma.userComment.delete({ where: { id } });
}
