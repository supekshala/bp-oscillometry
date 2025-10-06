import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Play, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { OscillometricSignalGenerator, SignalDataPoint } from '../utils/signalGenerator';

export function MonitorPage() {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [signalData, setSignalData] = useState<SignalDataPoint[]>([]);
    const [currentPressure, setCurrentPressure] = useState<number>(0);
    const generatorRef = useRef<OscillometricSignalGenerator | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startMonitoring = () => {
        // Initialize generator with random BP values for demo
        const systolic = 110 + Math.random() * 30;
        const diastolic = 70 + Math.random() * 20;
        const heartRate = 60 + Math.random() * 30;
        
        generatorRef.current = new OscillometricSignalGenerator(systolic, diastolic, heartRate);
        setSignalData([]);
        setIsMonitoring(true);

        // Update signal every 100ms
        intervalRef.current = setInterval(() => {
            if (generatorRef.current) {
                const point = generatorRef.current.getNextPoint();
                setCurrentPressure(point.pressure);
                
                setSignalData(prev => {
                    const newData = [...prev, point];
                    // Keep only last 100 points (10 seconds of data)
                    return newData.slice(-100);
                });

                // Stop when measurement is complete
                if (generatorRef.current.isComplete()) {
                    stopMonitoring();
                }
            }
        }, 100);
    };

    const stopMonitoring = () => {
        setIsMonitoring(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Activity className="h-6 w-6 text-heart-red" />
                            Real-Time BP Monitor
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-primary-blue">
                                {currentPressure.toFixed(1)} mmHg
                            </span>
                            {!isMonitoring ? (
                                <Button onClick={startMonitoring} className="flex items-center gap-2">
                                    <Play className="h-4 w-4" />
                                    Start Measurement
                                </Button>
                            ) : (
                                <Button onClick={stopMonitoring} variant="ghost" className="flex items-center gap-2">
                                    <Square className="h-4 w-4" />
                                    Stop
                                </Button>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={signalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="time" 
                                    label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }}
                                    stroke="#6b7280"
                                />
                                <YAxis 
                                    label={{ value: 'Pressure (mmHg)', angle: -90, position: 'insideLeft' }}
                                    stroke="#6b7280"
                                    domain={[0, 200]}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#ffffff', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="pressure" 
                                    stroke="#2563eb" 
                                    strokeWidth={2}
                                    dot={false}
                                    name="Cuff Pressure"
                                    isAnimationActive={false}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="oscillation" 
                                    stroke="#ef4444" 
                                    strokeWidth={2}
                                    dot={false}
                                    name="Oscillation Amplitude"
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 text-sm text-text-secondary">
                        <p>
                            This monitor simulates the <strong>oscillometric method</strong> of blood pressure measurement:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                            <li>The cuff inflates above systolic pressure (typically 180 mmHg)</li>
                            <li>As the cuff deflates, it detects pressure oscillations caused by blood flow</li>
                            <li>Oscillations are maximum at <strong>Mean Arterial Pressure (MAP)</strong></li>
                            <li>The algorithm determines systolic and diastolic pressures from the oscillation pattern</li>
                        </ol>
                        <p className="mt-4">
                            <strong>Blue line:</strong> Cuff pressure decreasing over time<br />
                            <strong>Red line:</strong> Oscillation amplitude (pulse strength)
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
