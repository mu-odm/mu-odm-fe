import { withAuth } from "next-auth/middleware";
import { match } from "path-to-regexp";

type roles = "ADMIN" | "SALESMAN";

interface IPATH {
  pathname: string;
  roles: roles[];
}

export const PATH: IPATH[] = [
    {
        pathname: "/admin/:id",
        roles: ["ADMIN"],
    },
    {
        pathname: "/salesman/:id",
        roles: ["SALESMAN", "ADMIN"],
    },
    {
        pathname: "/home/:id",
        roles: ["SALESMAN", "ADMIN"],
    }
  ];

export default withAuth({
    pages: {
      signIn: "/home/login",
      error: "/home/login",
    },
    callbacks: {
      async authorized({ req, token }) {
        if (!token) {
          if (req.nextUrl.pathname === "/home/login" || req.nextUrl.pathname === "/home/register") {
            return true;
          }
          return false;
        }
        const { nextUrl } = req;

        const isAuthorized = PATH.some(({ pathname, roles }) => {
          const isInRole = roles.some((role) => token.user!.role == role);
          const matching = match(pathname, { decode: decodeURIComponent });
          const isMatch = matching(nextUrl.pathname);

          return !!isMatch && isInRole;
        });

        return isAuthorized;
      },
    },
  });