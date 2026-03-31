import { Link } from 'react-router-dom';

const WishlistPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 max-w-lg w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
                    Wishlist <span className="text-orange-600">Coming Soon</span>
                </h1>
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                    We're working on something delicious. Soon you'll be able to save your favourite dishes and come back to them anytime.
                </p>
                <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                >
                    Browse Menu
                </Link>
            </div>
        </div>
    );
};

export default WishlistPage;
