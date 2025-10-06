import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { mockReadings } from '../mock-data';

const getCategory = (systolic: number, diastolic: number) => {
    if (systolic >= 180 || diastolic >= 120) return { name: 'Hypertensive Crisis', color: 'bg-bp-crisis text-white' };
    if (systolic >= 140 || diastolic >= 90) return { name: 'High BP (Stage 2)', color: 'bg-bp-stage2 text-white' };
    if (systolic >= 130 || diastolic >= 80) return { name: 'High BP (Stage 1)', color: 'bg-bp-stage1 text-white' };
    if (systolic >= 120) return { name: 'Elevated', color: 'bg-bp-elevated text-gray-800' };
    return { name: 'Normal', color: 'bg-bp-normal text-white' };
};

export function HistoryPage() {
    const readings = mockReadings;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reading History</CardTitle>
            </CardHeader>
            <CardContent>
                                <div className="overflow-x-auto rounded-lg border border-health-border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-health-background">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Systolic/Diastolic</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Pulse</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="bg-health-card divide-y divide-health-border">
                            {readings.map((reading) => {
                                const category = getCategory(reading.systolic, reading.diastolic);
                                return (
                                    <tr key={reading.id} className="hover:bg-health-background/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{new Date(reading.created_at).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{reading.systolic} / {reading.diastolic}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{reading.pulse}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.color}`}>
                                                {category.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{reading.notes}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
