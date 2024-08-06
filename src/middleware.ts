import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

import { ListModules, Module } from "@/types/auth/module";

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const url = request.nextUrl.clone();
    const pathnameArray: string[] = request.nextUrl.pathname.split("/");

    if (pathnameArray.length > 1) {
      const pageName = pathnameArray[1];
      const isPageAuthorized = ListModules.some((module: Module) =>
        module.pages?.includes(pageName)
      );

      if (isPageAuthorized) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      error: "/login",
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/user/:path*",
    "/product-category/:path*",
    "/product/:path*",
    "/transaction/:path*",
  ],
};
