import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

const analyticsClient = new BetaAnalyticsDataClient({
    credentials,
    projectId: credentials.project_id,
});

export async function GET() {
    try {
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
