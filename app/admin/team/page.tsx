import { prisma } from '@/lib/prisma';
import TeamAdminClient, { type TeamMemberRow } from './TeamAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminOurTeamPage() {
  let rows: TeamMemberRow[] = [];
  try {
    const list = await prisma.teamMember.findMany({
      orderBy: [{ memberType: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        name: true,
        memberRole: true,
        memberType: true,
        imageUrl: true,
        order: true,
        createdAt: true,
      },
    });
    rows = list.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch {
    rows = [];
  }

  return <TeamAdminClient initialMembers={rows} />;
}
