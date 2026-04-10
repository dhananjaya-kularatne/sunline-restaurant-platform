import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from '../components/CreatePostModal';

const CreatePostPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [createdPost, setCreatedPost] = useState(null);

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Please log in to create a post</h2>
                    <div className="mt-4">
                        <Link 
                            to="/login"
                            className="inline-flex items-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-700"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (createdPost) {
        const imageUrl = createdPost.imageUrl?.startsWith('/uploads/')
            ? `http://localhost:8080${createdPost.imageUrl}`
            : createdPost.imageUrl;
        const caption = createdPost.caption || '';

        return (
            <div className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                    <div className="p-8 text-center">
                        <div className="mb-4 flex justify-center">
                            <span className="text-6xl">🎉</span>
                        </div>
                        <h2 className="mb-6 text-3xl font-bold text-gray-900">Post Shared!</h2>
                        
                        <div className="mb-6 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                            <img 
                                src={imageUrl} 
                                alt="Post" 
                                className="h-64 w-full object-cover"
                            />
                            <div className="p-4 text-left">
                                <p className="text-lg italic text-gray-700">"{caption}"</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {createdPost.taggedItems?.map(tag => (
                                        <span key={tag} className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex w-full justify-center rounded-lg bg-orange-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-700 focus:outline-none"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent">
            <CreatePostModal 
                onClose={() => navigate(-1)} 
                onCreated={(post) => setCreatedPost(post)} 
            />
        </div>
    );
};

export default CreatePostPage;
