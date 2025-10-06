import { Activity, Calculator, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { mockReadings } from '../mock-data';

const getCategory = (systolic: number, diastolic: number) => {
    if (systolic >= 180 || diastolic >= 120) return { name: 'Hypertensive Crisis', color: 'text-bp-crisis' };
    if (systolic >= 140 || diastolic >= 90) return { name: 'High BP (Stage 2)', color: 'text-bp-stage2' };
    if (systolic >= 130 || diastolic >= 80) return { name: 'High BP (Stage 1)', color: 'text-bp-stage1' };
    if (systolic >= 120) return { name: 'Elevated', color: 'text-bp-elevated' };
    return { name: 'Normal', color: 'text-bp-normal' };
};

export function DashboardPage() {
    const readings = mockReadings;

    const latestReading = readings[0];
    const totalReadings = readings.length;
    const avgSystolic = totalReadings > 0 ? readings.reduce((sum, r) => sum + r.systolic, 0) / totalReadings : 0;
    const avgDiastolic = totalReadings > 0 ? readings.reduce((sum, r) => sum + r.diastolic, 0) / totalReadings : 0;

    const latestCategory = latestReading ? getCategory(latestReading.systolic, latestReading.diastolic) : null;
    const avgCategory = totalReadings > 0 ? getCategory(avgSystolic, avgDiastolic) : null;

    return (
        <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        Latest Reading <Activity className="h-5 w-5 text-text-secondary" />
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {latestReading ? (
                            <div>
                                <p className={`text-3xl font-bold ${latestCategory?.color}`}>
                                    {latestReading.systolic}/{latestReading.diastolic}
                                </p>
                                <p className="text-sm text-text-secondary">Pulse: {latestReading.pulse} BPM</p>
                                <p className={`text-sm font-medium ${latestCategory?.color}`}>{latestCategory?.name}</p>
                                <p className="text-xs text-muted mt-2">{new Date(latestReading.created_at).toLocaleString()}</p>
                            </div>
                        ) : (
                            <p>No readings yet.</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        Average <Calculator className="h-5 w-5 text-text-secondary" />
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {totalReadings > 0 ? (
                            <div>
                                <p className={`text-3xl font-bold ${avgCategory?.color}`}>
                                    {avgSystolic.toFixed(0)}/{avgDiastolic.toFixed(0)}
                                </p>
                                <p className={`text-sm font-medium ${avgCategory?.color}`}>{avgCategory?.name}</p>
                            </div>
                        ) : (
                            <p>No readings yet.</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                        Total Readings <Hash className="h-5 w-5 text-text-secondary" />
                    </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-accent-purple">{totalReadings}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
