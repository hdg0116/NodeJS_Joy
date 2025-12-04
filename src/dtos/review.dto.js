export const bodyToReview = (body) => ({
  userId: body.userId ?? null,
  title: body.title?.trim() || "",
  detail: body.detail?.trim() || "",
  rating: body.rating ? Number(body.rating) : null,
});

export const responseFromReview = (review) => {
  const formatDate = (date) => {
    const d = new Date(date);
    d.setHours(d.getHours() + 9);
    return d.toISOString().split("T")[0];
  };

  return {
    review_id: review.id,
    store_id: review.store_id,
    user_id: review.user_id,
    title: review.title,
    detail: review.detail,
    rating: review.rating,
    created_at: formatDate(review.created_at || new Date()),
  };
};

export const responseFromUserReviews = (reviews) => {
  return reviews.map((r) => ({
    reviewId: r.id,
    title: r.title,
    detail: r.detail,
    rating: r.rating,
    createdAt: r.created_at,
    storeName: r.store?.store,
  }));
};

export const responseFromMyReviews = (reviews) => {
  return reviews.map((r) => ({
    reviewId: r.id,
    title: r.title,
    detail: r.detail,
    rating: r.rating,
    createdAt: r.created_at,
    storeName: r.store?.store,
  }));
};