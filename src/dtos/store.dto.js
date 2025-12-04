export const responseFromReviews = (reviews) => {
  return {
    data: reviews.map((r) => ({
      reviewId: r.id,
      title: r.title,
      detail: r.detail,
      rating: r.rating,
      createdAt: r.created_at,
      userId: r.user_id,
      store: {
        id: r.store.id,
        name: r.store.store,
        address: r.store.address,
        description: r.store.description
      }
    })),
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};