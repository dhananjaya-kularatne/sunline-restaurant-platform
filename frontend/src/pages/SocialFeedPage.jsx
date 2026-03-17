import React, { useState, useEffect } from 'react';
import { Loader2, Utensils, MessageCircle } from 'lucide-react';
import feedService from '../services/feedService';
import { useAuth } from '../context/AuthContext';

const SocialFeedPage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await feedService.getFeed();
                setPosts(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching feed:', err);
                setError('Failed to load the feed. Please try again later.');
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);



    const getImageUrl = (url) => {
        if (url && url.startsWith('/uploads/')) {
            return `http://localhost:8080${url}`;
        }
        return url;
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 rounded-full bg-red-100 p-3 text-red-500">
                    <Utensils className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Oops!</h2>
                <p className="mt-2 text-gray-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 border-b border-orange-100 bg-white px-4 py-3 shadow-sm">
                <div className="mx-auto flex max-w-2xl items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                        <Utensils className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Sunline Bites</h1>
                        <p className="text-xs text-gray-500">Community Food Feed</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-md px-4 py-6 sm:max-w-xl">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                            <Utensils className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">No posts yet</h2>
                        <p className="mt-2 text-gray-600">Be the first to share a delicious meal!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div key={post.id} className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md">
                                {/* Author Header */}
                                <div className="flex items-center gap-3 px-4 pb-2 pt-4">
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-200">
                                        {post.author.profilePicture ? (
                                            <img
                                                src={getImageUrl(post.author.profilePicture)}
                                                alt={post.author.name}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : null}
                                        <div 
                                            className="flex h-full w-full items-center justify-center"
                                            style={{ display: post.author.profilePicture ? 'none' : 'flex' }}
                                        >
                                            <svg viewBox="0 0 24 24" className="h-6 w-6 text-gray-400" fill="currentColor">
                                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">{post.author.name}</h3>
                                        <p className="text-xs text-gray-400">
                                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Image */}
                                <div className="mt-2">
                                    <img
                                        src={getImageUrl(post.imageUrl)}
                                        alt="Food post"
                                        className="max-h-72 w-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/600x400?text=Food+Post';
                                        }}
                                    />
                                </div>

                                {/* Caption and Tags */}
                                <div className="px-4 pb-2 pt-3">
                                    <p className="text-sm text-gray-800">{post.caption}</p>
                                    {post.taggedItems && post.taggedItems.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {post.taggedItems.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs text-orange-600"
                                                >
                                                    🍽 {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialFeedPage;
