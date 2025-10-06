import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockReadings } from '../mock-data';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

interface AddReadingPageProps {
    onReadingAdded: () => void;
}

export function AddReadingPage({ onReadingAdded }: AddReadingPageProps) {
    const { user } = useAuth();
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [pulse, setPulse] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!user) {
            setError('You must be logged in to add a reading.');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            const newReading = {
                id: Math.random(),
                user_id: user.id,
                systolic: parseInt(systolic, 10),
                diastolic: parseInt(diastolic, 10),
                pulse: parseInt(pulse, 10),
                notes: notes || null,
                created_at: new Date().toISOString(),
            };

            mockReadings.unshift(newReading); // Add to the beginning of the array

            setSuccess('Reading added successfully!');
            // Clear form
            setSystolic('');
            setDiastolic('');
            setPulse('');
            setNotes('');
            // Notify parent to switch tabs
            onReadingAdded();
        }, 500);
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add New Reading</CardTitle>
                <CardDescription>Enter your latest blood pressure and pulse measurement.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="systolic">Systolic (mmHg)</Label>
                            <Input id="systolic" type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                            <Input id="diastolic" type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pulse">Pulse (BPM)</Label>
                            <Input id="pulse" type="number" value={pulse} onChange={(e) => setPulse(e.target.value)} required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., after morning coffee" />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}
                    <div className="flex justify-end">
                        <Button type="submit" className="w-full sm:w-auto">Save Reading</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
