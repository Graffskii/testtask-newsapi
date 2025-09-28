export interface INews {
    _id: string;
    title: string;
    content: string;
    author: string;
    status: 'draft' | 'published';
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}