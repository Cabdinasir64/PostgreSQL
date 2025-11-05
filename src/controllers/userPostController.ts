import { Request, Response } from 'express';
import * as postService from '../services/userPostService';

export async function getPosts(req: Request, res: Response) {
    try {
        const posts = await postService.getAllPosts();
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function getPost(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const post = await postService.getPostById(id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function createPost(req: Request, res: Response) {
    try {
        const { title, content, authorId } = req.body;
        if (!title || !authorId) return res.status(400).json({ success: false, message: 'Title and authorId are required' });

        const post = await postService.createPost({ title, content, authorId });
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function updatePost(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { title, content } = req.body;

        const post = await postService.updatePost(id, { title, content });
        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function deletePost(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await postService.deletePost(id);
        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
