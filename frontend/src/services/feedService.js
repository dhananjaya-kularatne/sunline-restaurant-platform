import api from './api';

const feedService = {
    getFeed: () => api.get('/feed'),
    createPost: (data) => api.post('/feed/posts', data),
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/feed/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    reactToPost: (postId, reactionType) =>
        api.post(`/feed/posts/${postId}/reactions`, { reactionType }),
};

export default feedService;
