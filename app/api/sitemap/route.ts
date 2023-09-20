import { AppConstants } from "@/utils/constants";
import { listFolder } from "@/utils/dbx/api_client";
import { SharedLink } from "@/utils/dbx/common";
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const workList = (await listFolder(SharedLink, AppConstants.WORK_FOLDER_PATH)).entries;
    const lastMode = '2023-09-20'
    // generate sitemap here
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
        <url>
            <loc>${request.nextUrl.origin}</loc>
            <lastmod>${lastMode}</lastmod>
        </url>
        <url>
            <loc>${request.nextUrl.origin}/about</loc>
            <lastmod>${lastMode}</lastmod>
        </url>
        <url>
            <loc>${request.nextUrl.origin}/work</loc>
            <lastmod>${lastMode}</lastmod>
        </url>
        ${
            workList.map(work => {
                return `<url>
                    <loc>${request.nextUrl.origin}/work/${encodeURI(work.name)}</loc>
                    <lastmod>${lastMode}</lastmod>
                </url>`
            }).join('\n')
        }
    </urlset>`

    return new NextResponse(xml, {
        headers: {
            'content-type': 'text/xml',
            'cache-control': 'stale-while-revalidate, s-maxage=3600'
        }
    })
}