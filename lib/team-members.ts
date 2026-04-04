import { prisma } from '@/lib/prisma';
import type { TeamMemberType } from '@prisma/client';

export type HomeMember = {
  name: string;
  imageUrl: string;
  memberRole: string;
};

const FALLBACK_TEAM: HomeMember[] = [
  { name: 'Gabriel', imageUrl: '/images/team/gabriel.png', memberRole: '' },
  { name: 'Emeka', imageUrl: '/images/team/emeka2.png', memberRole: '' },
  { name: 'Emma', imageUrl: '/images/team/emma.png', memberRole: '' },
  { name: 'Ekene', imageUrl: '/images/team/ekene.png', memberRole: '' },
];

const FALLBACK_BOARD: HomeMember[] = [
  { name: 'Chukwuma', imageUrl: '/images/board/chukwuma.png', memberRole: '' },
  { name: 'Nnamdi', imageUrl: '/images/board/nnamdi.png', memberRole: '' },
  { name: 'Rotanna', imageUrl: '/images/board/rotanna.png', memberRole: '' },
];

function isEphemeralHost(): boolean {
  return !!(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function isUsableTeamImageUrl(url: string, ephemeralHost: boolean): boolean {
  if (!url) return false;
  if (url.startsWith('https://') || url.startsWith('http://')) return true;
  if (ephemeralHost && url.startsWith('/team/')) return false;
  return url.startsWith('/');
}

async function loadMembersForType(
  memberType: TeamMemberType,
  fallback: HomeMember[],
): Promise<HomeMember[]> {
  const ephemeralHost = isEphemeralHost();
  try {
    const rows = await prisma.teamMember.findMany({
      where: { memberType },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      select: { name: true, imageUrl: true, memberRole: true },
    });
    const usable = rows
      .filter((r) => isUsableTeamImageUrl(r.imageUrl, ephemeralHost))
      .map((r) => ({
        name: r.name,
        imageUrl: r.imageUrl,
        memberRole: r.memberRole || '',
      }));
    return usable.length > 0 ? usable : fallback;
  } catch {
    return fallback;
  }
}

export async function getTeamMembersForHome(): Promise<HomeMember[]> {
  return loadMembersForType('TEAM', FALLBACK_TEAM);
}

export async function getBoardMembersForHome(): Promise<HomeMember[]> {
  return loadMembersForType('BOARD', FALLBACK_BOARD);
}
