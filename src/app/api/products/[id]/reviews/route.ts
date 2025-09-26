import { NextRequest, NextResponse } from 'next/server';

// Mock reviews database
const reviewsDatabase: Record<number, any[]> = {
  1: [
    {
      id: 1,
      userId: 101,
      userName: "Sarah Johnson",
      userAvatar: "https://i.pravatar.cc/150?u=sarah",
      rating: 5,
      comment: "Amazing quality! The jacket fits perfectly and looks exactly as shown. The material feels premium and the stitching is excellent. Highly recommend this product!",
      date: "2024-01-15T10:30:00Z",
      verified: true,
      helpful: 12,
      images: []
    },
    {
      id: 2,
      userId: 102,
      userName: "Mike Chen",
      userAvatar: "https://i.pravatar.cc/150?u=mike",
      rating: 4,
      comment: "Great jacket, good value for money. The fit is as expected and the quality is solid. Only wish it came in more color options. Delivery was fast too.",
      date: "2024-01-10T14:20:00Z",
      verified: true,
      helpful: 8,
      images: []
    },
    {
      id: 3,
      userId: 103,
      userName: "Emma Davis",
      userAvatar: "https://i.pravatar.cc/150?u=emma",
      rating: 5,
      comment: "Perfect for the winter season. Very warm and stylish. The water-resistant coating works great. Will definitely buy from this brand again!",
      date: "2024-01-08T09:15:00Z",
      verified: false,
      helpful: 15,
      images: []
    },
    {
      id: 4,
      userId: 104,
      userName: "James Wilson",
      userAvatar: "https://i.pravatar.cc/150?u=james",
      rating: 4,
      comment: "Good jacket overall. The size runs a bit large so consider ordering one size down. Quality is good for the price point.",
      date: "2024-01-05T16:45:00Z",
      verified: true,
      helpful: 6,
      images: []
    }
  ],
  2: [
    {
      id: 5,
      userId: 105,
      userName: "Lisa Brown",
      userAvatar: "https://i.pravatar.cc/150?u=lisa",
      rating: 5,
      comment: "Love this shirt! Perfect for casual office wear. The cotton is soft and breathable.",
      date: "2024-01-12T11:20:00Z",
      verified: true,
      helpful: 4,
      images: []
    }
  ],
  3: [
    {
      id: 6,
      userId: 106,
      userName: "David Kim",
      userAvatar: "https://i.pravatar.cc/150?u=david",
      rating: 4,
      comment: "Comfortable shoes, good quality leather. Worth the price.",
      date: "2024-01-14T13:10:00Z",
      verified: true,
      helpful: 3,
      images: []
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'date';
    const orderBy = searchParams.get('orderBy') || 'desc';

    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const reviews = reviewsDatabase[productId] || [];

    // Sort reviews
    const sortedReviews = [...reviews].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return orderBy === 'desc' ? dateB - dateA : dateA - dateB;
      } else if (sortBy === 'rating') {
        return orderBy === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      } else if (sortBy === 'helpful') {
        return orderBy === 'desc' ? b.helpful - a.helpful : a.helpful - b.helpful;
      }
      return 0;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return NextResponse.json({
      reviews: paginatedReviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit),
        hasNext: endIndex < totalReviews,
        hasPrev: page > 1
      },
      statistics: {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
        ratingDistribution,
        verifiedCount: reviews.filter(r => r.verified).length
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Validate review data
    const { rating, comment, userId, userName } = body;

    if (!rating || !comment || !userId || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Simulate database write delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create new review
    const newReview = {
      id: Date.now(), // In production, use proper ID generation
      userId,
      userName,
      userAvatar: `https://i.pravatar.cc/150?u=${userName.toLowerCase().replace(' ', '')}`,
      rating,
      comment,
      date: new Date().toISOString(),
      verified: false, // Would be determined by purchase history
      helpful: 0,
      images: body.images || []
    };

    // Add to database
    if (!reviewsDatabase[productId]) {
      reviewsDatabase[productId] = [];
    }
    reviewsDatabase[productId].unshift(newReview);

    return NextResponse.json(newReview, { status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}