import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockUser } from '../mock-data';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

interface RegisterPageProps {
    onSwitchToLogin: () => void;
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Simulate API call
        setTimeout(() => {
            if (username && name && password) {
                // In a real app, you'd get the new user back from the API
                login({ ...mockUser, username, name });
            } else {
                setError('All fields are required');
            }
        }, 500);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create a new account to start tracking your blood pressure.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <Button type="submit" className="w-full">Create Account</Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-text-secondary">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="font-medium text-primary-blue hover:underline">
                            Log In
                        </button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
