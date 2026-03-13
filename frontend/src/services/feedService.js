import api from './api';

const feedService = {
    createPost: (data) => api.post('/feed/posts', data),
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/feed/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default feedService;
