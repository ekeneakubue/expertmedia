import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, imageUrl: true },
    orderBy: { createdAt: "desc" },
  });

  return <UsersClient initialUsers={users} />;
}


