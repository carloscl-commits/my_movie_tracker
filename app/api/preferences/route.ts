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
      let preferences = await prisma.userPreferences.findUnique({
        where: { id: 1 },
      });

      // Create default preferences if they don't exist
      if (!preferences) {
        preferences = await prisma.userPreferences.create({
          data: {
            id: 1,
            theme: 'light',
            accentColor: '#3b82f6',
          },
        });
      }

      return NextResponse.json({ preferences });
    } catch (error) {
      console.error('Error fetching preferences:', error);
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      );
    }
  }

  if (request.method === 'PUT') {
    try {
      const body = await request.json();
      const { theme, accentColor } = body;

      // Validate input
      if (theme && !['light', 'dark'].includes(theme)) {
        return NextResponse.json(
          { error: 'Invalid theme' },
          { status: 400 }
        );
      }

      if (accentColor && !/^#[0-9A-F]{6}$/i.test(accentColor)) {
        return NextResponse.json(
          { error: 'Invalid color format' },
          { status: 400 }
        );
      }

      const updateData: any = {};
      if (theme) updateData.theme = theme;
      if (accentColor) updateData.accentColor = accentColor;

      const preferences = await prisma.userPreferences.upsert({
        where: { id: 1 },
        update: updateData,
        create: {
          id: 1,
          theme: theme || 'light',
          accentColor: accentColor || '#3b82f6',
        },
      });

      return NextResponse.json({ preferences });
    } catch (error) {
      console.error('Error updating preferences:', error);
      return NextResponse.json(
        { error: 'Failed to update preferences' },
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

export function PUT(request: NextRequest) {
  return handler(request);
}
