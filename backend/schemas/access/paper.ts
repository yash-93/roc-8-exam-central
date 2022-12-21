import { ListAccessArgs } from "../../types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

export const rules = {
  papersQueryFilter({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return { status: { equals: 'published' } }
    }

    // if (session?.data.role === 'admin' || session?.data.role === 'moderator') {
    //   return true;
    // }

    return {
      OR: [
        {
          uploadedBy: { id: { equals: session?.itemId } }
        },
        {
          status: { equals: 'published' }
        }
      ]
    }
  },
  papersUpdateFilter({ session }: ListAccessArgs) {
    return { uploadedBy: { equals: { id: session?.itemId } } }
  },
  canUpdatePapers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    if (session?.data.role === 'admin' || session?.data.role === 'moderator') {
      return true;
    }

    return false;
  },
  canDeletePapers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    return session?.data.role === 'admin' || session?.data.role === 'moderator';
  }
}
