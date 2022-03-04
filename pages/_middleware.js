import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'


export default async function middleware(req) {
    // Token will exist if user is logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl
    // Redirect them to homepage if they have a token and are trying to access login page
    if (token && pathname === "/login") {
        const url = req.nextUrl.clone();
        url.pathname = '/'
        return NextResponse.redirect(url);
    }

    // Allow the request if the following is true
    // 1) its a request for the  next-auth session  and provider featching
    // 2) the token exist 
    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }


    // Redirect them to login if they dont have a token and are requesting a protected route
    if (!token && pathname !== "/login") {
        const url = req.nextUrl.clone();
        url.pathname = '/login'
        return NextResponse.redirect(url);
    }
}