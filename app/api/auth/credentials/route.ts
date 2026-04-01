import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth.config';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  const authSession = await getServerSession(authConfig);

  if (!authSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      );
    }

    if (!newUsername && !newPassword) {
      return NextResponse.json(
        { error: 'Provide a new username or password' },
        { status: 400 }
      );
    }

    if (newUsername && newUsername.trim().length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (newPassword && newPassword.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters' },
        { status: 400 }
      );
    }

    // Verify current password
    const existingCredentials = await prisma.userCredentials.findUnique({
      where: { id: 1 },
    });

    if (existingCredentials) {
      const isValid = await bcrypt.compare(
        currentPassword,
        existingCredentials.passwordHash
      );
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 403 }
        );
      }
    } else {
      // First time: verify against env vars
      if (currentPassword !== process.env.AUTH_PASSWORD) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 403 }
        );
      }
    }

    // Build update data
    const updateData: { username?: string; passwordHash?: string } = {};
    if (newUsername) updateData.username = newUsername.trim();
    if (newPassword) updateData.passwordHash = await bcrypt.hash(newPassword, 10);

    // Upsert credentials
    const currentUsername =
      existingCredentials?.username || process.env.AUTH_USERNAME || 'admin';
    const currentHash =
      existingCredentials?.passwordHash ||
      (await bcrypt.hash(process.env.AUTH_PASSWORD || 'password', 10));

    await prisma.userCredentials.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        id: 1,
        username: updateData.username || currentUsername,
        passwordHash: updateData.passwordHash || currentHash,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating credentials:', error);
    return NextResponse.json(
      { error: 'Failed to update credentials' },
      { status: 500 }
    );
  }
}
