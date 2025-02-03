import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { getAdminSession } from '@/lib/session';
import Admin from '@/models/admin';
import connectToDatabase from '@/lib/mongodb';

// Decode Base64 to JSON
const serviceAccountJSON = Buffer.from(
    process.env.GOOGLE_SERVICE_ACCOUNT,
    'base64'
).toString('utf-8');

const credentials = JSON.parse(serviceAccountJSON);

const analyticsClient = new BetaAnalyticsDataClient({
    credentials,
    projectId: credentials.project_id,
});

export async function GET(request) {
    try {
        //check admin
        await connectToDatabase();
        const session = await getAdminSession(request.cookies.get('adminSession')?.value);
        if (!session?.adminId) {
            console.log("here")
            return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
        }
        const admin = await Admin.findById(session.adminId);
        if (!admin) {
            console.log("here2")
            return Response.json({ success: false, error: "נו באמת לא חשבת שזה יהיה כזה קל" }, { status: 401 });
        }
        console.log("here3")

        const [response] = await analyticsClient.runReport({
            property: `properties/${process.env.GA4_PROPERTY_ID}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [
                { name: 'activeUsers' }, // Total users
                { name: 'screenPageViews' }, // Page views
            ],
            dimensions: [{ name: 'country' }], // Optional: Group by country
        });

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json(
            { error: error.message || 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
