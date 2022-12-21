import { ListAccessArgs } from "../../types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

export const rules = {
  canReadCourses({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return { status: { equals: 'published' } }
    }

    // if (session?.data.role === 'admin' || session?.data.role === 'moderator') {
    //   return true;
    // }

    return {
      OR: [
        {
          status: { equals: 'published' }
        }
      ]
    }
  },
  canUpdateCourses({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    return session?.data.role === 'admin' || session?.data.role === 'moderator';
  },
  canDeleteCourses({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    return session?.data.role === 'admin' || session?.data.role === 'moderator';
  }
}
