import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth.config';
import { prisma } from '@/lib/prisma';

async function handler(request: NextRequest) {
  const authSession = await getServerSession(authConfig);

  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.method === 'GET') {
    try {
      const movies = await prisma.movie.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ movies });
    } catch (error) {
      console.error('Error fetching movies:', error);
      return NextResponse.json(
        { error: 'Failed to fetch movies' },
        { status: 500 }
      );
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { tmdbId, title, year, posterUrl, synopsis, genreIds } = body;

      // Validate required fields
      if (!tmdbId || !title) {
        return NextResponse.json(
          { error: 'Missing required fields: tmdbId, title' },
          { status: 400 }
        );
      }

      // Check if movie already exists
      const existing = await prisma.movie.findUnique({
        where: { tmdbId },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Movie already in collection' },
          { status: 409 }
        );
      }

      // Create new movie
      const movie = await prisma.movie.create({
        data: {
          tmdbId,
          title,
          year: year || null,
          posterUrl: posterUrl || null,
          synopsis: synopsis || null,
          genres: genreIds ? JSON.stringify(genreIds) : null,
          status: 'unseen',
          personalRating: null,
        },
      });

      return NextResponse.json({ movie }, { status: 201 });
    } catch (error) {
      console.error('Error creating movie:', error);
      return NextResponse.json(
        { error: 'Failed to create movie' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export function GET(request: NextRequest) {
  return handler(request);
}

export function POST(request: NextRequest) {
  return handler(request);
}
