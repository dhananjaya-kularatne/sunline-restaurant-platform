import React, { useState } from 'react';
import feedService from '../services/feedService';
import { Upload, X, ImagePlus } from 'lucide-react';

const CreatePostModal = ({ onClose, onCreated }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [taggedItems, setTaggedItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            e.preventDefault();
            if (tagInput.trim() && !taggedItems.includes(tagInput.trim())) {
                setTaggedItems([...taggedItems, tagInput.trim()]);
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTaggedItems(taggedItems.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedFile) {
            setError("A photo is required.");
            return;
        }
        if (!caption.trim()) {
            setError("Caption cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            // First upload image
            const uploadRes = await feedService.uploadImage(selectedFile);
            const imageUrl = uploadRes.data.url;

            // Then create post — ensure taggedItems is always an array, never null
            const res = await feedService.createPost({
                imageUrl,
                caption,
                taggedItems: taggedItems ?? [],
            });
            onCreated(res.data);
        } catch (err) {
            // api.js converts Axios errors to plain Error objects, so use err.message
            setError(err.message || "Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Close"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">
                    <ImagePlus className="h-6 w-6 text-orange-500" />
                    Share Your Meal
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo <span className="text-red-500">*</span></label>
                        {!previewUrl ? (
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-orange-600">Click to upload a photo</span></p>
                                    <p className="text-xs text-gray-400">PNG, JPG or JPEG</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        ) : (
                            <div className="relative mt-1 overflow-hidden rounded-lg border border-gray-200">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="h-48 w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreviewUrl('');
                                    }}
                                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Caption <span className="text-red-500">*</span></label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            rows="3"
                            placeholder="Tell everyone about your meal..."
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400 sm:text-sm"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tag Menu Items</label>
                        <div className="mt-1 flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Add a tag..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400 sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="inline-flex items-center rounded-md border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {taggedItems.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-sm font-medium text-orange-800"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-orange-400 hover:bg-orange-200 hover:text-orange-500 focus:bg-orange-500 focus:text-white focus:outline-none"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:bg-orange-300"
                        >
                            {loading ? (
                                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Share Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
