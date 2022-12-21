import { ListAccessArgs } from "../../types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

export const rules = {
  universitiesFilter({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return { status: { equals: 'published' } }
    }

    return {
      OR: [
        {
          status: { equals: 'published' }
        }
      ]
    }
  },
  canUpdateUniversities({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    return session?.data.role === 'admin' || session?.data.role === 'moderator';
  },
  canDeleteUniversities({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    return session?.data.role === 'admin' || session?.data.role === 'moderator';
  }
}
