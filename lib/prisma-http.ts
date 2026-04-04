import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

/** Map Prisma / driver connection failures to a JSON 503 for API routes. */
export function dbUnreachableResponse(e: unknown): NextResponse | null {
  if (e instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      {
        message:
          'Cannot reach the database. Check DATABASE_URL, that Neon is awake, and run npm run db:push if the schema changed.',
        code: 'DB_UNREACHABLE',
      },
      { status: 503 },
    );
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P1001' || e.code === 'P1017') {
      return NextResponse.json(
        {
          message:
            'Database server is unreachable or the connection closed. Retry in a moment; wake your Neon project if it is suspended.',
          code: 'DB_UNREACHABLE',
        },
        { status: 503 },
      );
    }
  }
  const msg = e instanceof Error ? e.message : String(e);
  if (
    msg.includes('P1001') ||
    msg.includes("Can't reach database") ||
    msg.includes('kind: Closed') ||
    /connection.*closed/i.test(msg)
  ) {
    return NextResponse.json(
      {
        message:
          'Database connection failed or was closed. Check Neon status, DATABASE_URL, and try again.',
        code: 'DB_UNREACHABLE',
      },
      { status: 503 },
    );
  }
  return null;
}
