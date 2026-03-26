import React, { useState, useEffect } from 'react';
import { Loader2, Utensils, MessageCircle, Plus, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import feedService from '../services/feedService';
import { useAuth } from '../context/AuthContext';

const REACTIONS = [
    { type: 'DELICIOUS', emoji: '😋', label: 'Delicious' },
    { type: 'LOVE', emoji: '❤️', label: 'Love it' },
    { type: 'WOW', emoji: '🤩', label: 'Wow' },
    { type: 'GROSS', emoji: '🤢', label: 'Gross' },
    { type: 'ANGRY', emoji: '😤', label: 'Not okay' },
];

const SocialFeedPage = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openReactionPostId, setOpenReactionPostId] = useState(null);

    // SN-20 Comments State
    const [openCommentPostId, setOpenCommentPostId] = useState(null);
    const [commentsMap, setCommentsMap] = useState({});
    const [commentTextMap, setCommentTextMap] = useState({});
    const [loadingCommentsMap, setLoadingCommentsMap] = useState({});

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.reaction-popover-container')) {
                setOpenReactionPostId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleReaction = async (postId, reactionType) => {
        if (!user) return; // guests cannot react
        try {
            const response = await feedService.reactToPost(postId, reactionType);
            setPosts(prev => prev.map(p =>
                p.id === postId ? response.data : p
            ));
        } catch (err) {
            console.error('Reaction error:', err);
        }
    };

    const handleToggleComments = async (postId) => {
        if (openCommentPostId === postId) {
            setOpenCommentPostId(null);
            return;
        }

        setOpenCommentPostId(postId);

        // Fetch comments if not already loaded or to refresh
        setLoadingCommentsMap(prev => ({ ...prev, [postId]: true }));
        try {
            const response = await feedService.getComments(postId);
            setCommentsMap(prev => ({ ...prev, [postId]: response.data }));
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoadingCommentsMap(prev => ({ ...prev, [postId]: false }));
        }
    };

    const handleAddComment = async (postId) => {
        const content = commentTextMap[postId];
        if (!content || !content.trim() || !user) return;

        try {
            const response = await feedService.addComment(postId, content);
            setCommentsMap(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), response.data]
            }));
            setCommentTextMap(prev => ({ ...prev, [postId]: '' }));
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await feedService.deleteComment(postId, commentId);
            setCommentsMap(prev => ({
                ...prev,
                [postId]: prev[postId].filter(c => c.id !== commentId)
            }));
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`;
        return `http://localhost:8080/uploads/${url}`;
    };

    const formatRelativeDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

            {/* Main Content */}
            <div className="mx-auto max-w-6xl px-4 pt-5 pb-12">
                {/* Interactive Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-gray-200 pb-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            <span className="block">Welcome to the</span>
                            <span className="block bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                                Social Feed
                            </span>
                        </h1>
                        <p className="max-w-2xl text-lg text-gray-500">
                            Discover delicious meals and share your culinary adventures with the community.
                        </p>
                    </div>

                    {user && (
                        <Link
                            to="/create-post"
                            className="-mt-2 inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-100 transition-all hover:scale-105 hover:bg-orange-600 active:scale-95"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Share a Post
                        </Link>
                    )}
                </div>
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                            <Utensils className="h-10 w-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">No posts yet</h2>
                        <p className="mt-2 text-gray-600">Be the first to share a delicious meal!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                        {posts.map((post) => {
                            const totalReactions = Object.values(post.reactionCounts || {}).reduce((acc, val) => acc + val, 0);
                            const isCommentsOpen = openCommentPostId === post.id;

                            return (
                                <div key={post.id} className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md flex flex-col h-[520px]">
                                    {/* Author Header (Fixed) */}
                                    {user ? (
                                        <Link to={`/user/${post.author.id}`} className="flex items-center gap-3 px-4 pb-2 pt-4 shrink-0 transition-colors hover:opacity-80">
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
                                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
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
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-3 px-4 pb-2 pt-4 shrink-0">
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
                                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
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
                                    )}

                                    {/* Post Image (Fixed h-48) */}
                                    <div className="mt-2 h-48 shrink-0 overflow-hidden border-y border-gray-50">
                                        <img
                                            src={getImageUrl(post.imageUrl) || '/images/food_placeholder.png'}
                                            alt="Food post"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/images/food_placeholder.png';
                                            }}
                                        />
                                    </div>

                                    {/* Main Dynamic Area - Internal Scrolling */}
                                    <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
                                        {/* Caption and Tags */}
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-800 leading-relaxed font-medium">{post.caption}</p>
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

                                        {/* Inline Comments Section (inside scroll area) */}
                                        {isCommentsOpen && (
                                            <div className="border-t border-gray-100 bg-gray-50/30 -mx-4 px-4 pt-4">
                                                {/* Comments List */}
                                                <div className="space-y-4">
                                                    {loadingCommentsMap[post.id] ? (
                                                        <div className="flex justify-center py-4">
                                                            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                                                        </div>
                                                    ) : commentsMap[post.id]?.length === 0 ? (
                                                        <p className="text-center text-xs text-gray-400 py-2 italic font-medium">No comments yet. Be the first to say something!</p>
                                                    ) : (
                                                        commentsMap[post.id]?.map((comment) => (
                                                            <div key={comment.id} className="space-y-1 pb-2 border-b border-gray-100 last:border-0">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-6 w-6 overflow-hidden rounded-full bg-gray-200 shrink-0 border border-gray-100">
                                                                        {comment.author.profilePicture ? (
                                                                            <img
                                                                                src={getImageUrl(comment.author.profilePicture)}
                                                                                alt=""
                                                                                className="h-full w-full object-cover"
                                                                            />
                                                                        ) : (
                                                                            <div className="flex h-full w-full items-center justify-center">
                                                                                <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400" fill="currentColor">
                                                                                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-[11px] font-bold text-gray-900 leading-none">{comment.author.name}</span>
                                                                        <span className="text-[9px] text-gray-400 mt-0.5">{formatRelativeDate(comment.createdAt)}</span>
                                                                    </div>
                                                                    {user && user.name === comment.author.name && (
                                                                        <button
                                                                            onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                            className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded ml-auto"
                                                                            title="Delete comment"
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <polyline points="3 6 5 6 21 6" />
                                                                                <path d="M19 6l-1 14H6L5 6" />
                                                                                <path d="M10 11v6M14 11v6" />
                                                                                <path d="M9 6V4h6v2" />
                                                                            </svg>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <p className="pl-8 text-xs text-gray-600 leading-relaxed font-normal">
                                                                    {comment.content}
                                                                </p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Interaction Bar & Comment Input (Always at Bottom) */}
                                    <div className="shrink-0 border-t border-gray-100 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.02)]">
                                        <div className="grid grid-cols-2 items-center px-4 py-2">
                                            <div className="reaction-popover-container relative">
                                                {/* Reaction Button */}
                                                <button
                                                    onClick={() => setOpenReactionPostId(openReactionPostId === post.id ? null : post.id)}
                                                    className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500 transition-all flex items-center gap-2 group"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                        className="group-hover:scale-110 transition-transform">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                                        <line x1="9" y1="9" x2="9.01" y2="9" />
                                                        <line x1="15" y1="9" x2="15.01" y2="9" />
                                                    </svg>
                                                    {totalReactions > 0 && (
                                                        <span className="text-xs text-gray-500 font-bold group-hover:text-orange-600">{totalReactions}</span>
                                                    )}
                                                </button>

                                                {/* Reaction Popover */}
                                                {openReactionPostId === post.id && (
                                                    <div className="absolute bottom-full left-0 mb-3 z-[250] bg-white rounded-2xl shadow-xl border border-gray-100 px-3 py-2 flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                                                        {REACTIONS.map((reaction) => (
                                                            <button
                                                                key={reaction.type}
                                                                onClick={() => handleReaction(post.id, reaction.type)}
                                                                className={`flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-orange-50 transition-all min-w-[48px] ${post.currentUserReaction === reaction.type ? 'ring-2 ring-orange-400 bg-orange-50' : ''
                                                                    }`}
                                                            >
                                                                <span className="text-2xl hover:scale-125 transition-transform">{reaction.emoji}</span>
                                                                <span className="text-[10px] text-gray-400 font-bold">{post.reactionCounts?.[reaction.type] ?? 0}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Comment Button (Lucide MessageCircle) - To Toggle Comments */}
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleToggleComments(post.id)}
                                                    className={`rounded-full border p-2 px-3 text-gray-500 transition-all flex items-center gap-2 ${isCommentsOpen ? 'border-orange-300 bg-orange-50 text-orange-500 font-bold' : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500'
                                                        }`}
                                                >
                                                    <MessageCircle className="h-5 w-5" />
                                                    {commentsMap[post.id]?.length > 0 && (
                                                        <span className="text-xs">{commentsMap[post.id].length}</span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Optional Input Section (Inside the sticky footer) */}
                                        {isCommentsOpen && user && (
                                            <div className="border-t border-gray-50 bg-gray-50/20 p-3">
                                                <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 px-1 py-1 shadow-sm focus-within:border-orange-300 focus-within:ring-1 focus-within:ring-orange-100 transition-all">
                                                    <input
                                                        type="text"
                                                        value={commentTextMap[post.id] || ''}
                                                        onChange={(e) => setCommentTextMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                        placeholder="Write a comment..."
                                                        className="flex-1 bg-transparent px-3 py-1.5 text-xs text-gray-800 focus:outline-none"
                                                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                                    />
                                                    <button
                                                        onClick={() => handleAddComment(post.id)}
                                                        disabled={!commentTextMap[post.id]?.trim()}
                                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white transition-all hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm"
                                                    >
                                                        <Send className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialFeedPage;
