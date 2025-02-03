'use client';

import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AnalyticsDashboard() {
    const { data, error } = useSWR('/api/analytics', fetcher);

    if (error) return <div>Error loading analytics</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <div>
            <h2>Active Users: {data?.totals?.[0]?.metricValues?.[0]?.value || 0}</h2>
            <h2>Page Views: {data?.totals?.[0]?.metricValues?.[1]?.value || 0}</h2>

            {/* Display countries (if using dimensions) */}
            {data?.rows?.map((row, index) => (
                <div key={index}>
                    <p>Country: {row.dimensionValues[0].value}</p>
                    <p>Users: {row.metricValues[0].value}</p>
                </div>
            ))}
        </div>
    );
}
