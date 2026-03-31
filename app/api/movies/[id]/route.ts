import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth.config';
import { prisma } from '@/lib/prisma';

async function authenticate() {
  const authSession = await getServerSession(authConfig);
  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

async function getMovieId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const movieId = parseInt(id);
  if (isNaN(movieId)) {
    return { error: NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 }) };
  }
  return { movieId };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await authenticate();
  if (authError) return authError;

  const result = await getMovieId(params);
  if ('error' in result) return result.error;

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: result.movieId },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ movie });
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await authenticate();
  if (authError) return authError;

  const result = await getMovieId(params);
  if ('error' in result) return result.error;

  try {
    const body = await request.json();
    const { personalRating, status, favorite } = body;

    if (personalRating !== null && personalRating !== undefined) {
      if (typeof personalRating !== 'number' || personalRating < 1 || personalRating > 5) {
        return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
      }
    }

    if (status && !['unseen', 'seen'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updateData: any = {};
    if (personalRating !== undefined) updateData.personalRating = personalRating;
    if (status) updateData.status = status;
    if (typeof favorite === 'boolean') updateData.favorite = favorite;

    const movie = await prisma.movie.update({
      where: { id: result.movieId },
      data: updateData,
    });

    return NextResponse.json({ movie });
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await authenticate();
  if (authError) return authError;

  const result = await getMovieId(params);
  if ('error' in result) return result.error;

  try {
    const movie = await prisma.movie.delete({
      where: { id: result.movieId },
    });

    return NextResponse.json({ movie });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}
