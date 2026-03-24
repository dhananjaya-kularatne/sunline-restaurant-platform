import api from './api';

const feedService = {
  getFeed: () => api.get('/feed'),

  createPost: (postData) => api.post('/feed/posts', postData),

  uploadImage: (formData) => api.post('/feed/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  reactToPost: (postId, reactionType) => api.post(`/feed/posts/${postId}/reactions`, {
    reactionType
  }),

  getComments: (postId) => api.get(`/feed/posts/${postId}/comments`),

  addComment: (postId, content) => api.post(`/feed/posts/${postId}/comments`, {
    content
  }),

  deleteComment: (postId, commentId) =>
    api.delete(`/feed/posts/${postId}/comments/${commentId}`)
};

export default feedService;
