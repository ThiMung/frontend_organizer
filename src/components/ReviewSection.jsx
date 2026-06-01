const StarIcon = ({ active, className = 'w-3 h-3' }) => (
    <svg
        className={`${className} ${active ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const formatReviewDate = (dateValue) => {
    if (!dateValue) return 'Recent';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Recent';

    return date.toLocaleDateString('en-US');
};

const getReviewerName = (review) => (
    review.user?.name
    || review.user_name
    || review.attendee_name
    || 'Anonymous User'
);

export const ReviewSection = ({ reviews }) => {
    const reviewsList = Array.isArray(reviews) ? reviews : [];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-black flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                </span>
                Participant Reviews ({reviewsList.length})
            </h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {reviewsList.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No participant reviews yet.</p>
                ) : (
                    reviewsList.map((review, index) => (
                        <div
                            key={review.id ?? `${review.user_id ?? 'review'}-${review.created_at ?? index}`}
                            className="p-3 border-b border-gray-100 flex flex-col gap-1 bg-white"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-bold text-gray-800">
                                    {getReviewerName(review)}
                                </span>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                    {formatReviewDate(review.created_at)}
                                </span>
                            </div>

                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                        key={star}
                                        active={star <= Number(review.rating)}
                                    />
                                ))}
                            </div>

                            <p className="text-xs text-gray-600 mt-1 leading-relaxed bg-gray-50/50 p-2 rounded-md">
                                {review.comment || 'No comment provided.'}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
