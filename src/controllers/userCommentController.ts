import { Request, Response } from 'express';
import * as commentService from '../services/userCommentService';

export async function getComments(req: Request, res: Response) {
    try {
        const comments = await commentService.getAllComments();
        res.json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function getComment(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const comment = await commentService.getCommentById(id);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
        res.json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function createComment(req: Request, res: Response) {
    try {
        const { text, postId, authorId } = req.body;
        if (!text || !postId || !authorId) {
            return res.status(400).json({ success: false, message: 'text, postId and authorId are required' });
        }
        const comment = await commentService.createComment({ text, postId, authorId });
        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function updateComment(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { text } = req.body;
        if (!text) return res.status(400).json({ success: false, message: 'text is required' });

        const comment = await commentService.updateComment(id, text);
        res.json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export async function deleteComment(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        await commentService.deleteComment(id);
        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
