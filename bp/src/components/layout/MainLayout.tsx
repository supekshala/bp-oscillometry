import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { LayoutDashboard, Activity, PlusCircle, History, LogOut } from 'lucide-react';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-app-background">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-primary-blue">BP Monitor</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-text-primary">Welcome, {user?.name}</span>
                            <Button variant="ghost" size="icon" onClick={logout} aria-label="Log out">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}

// This is a simplified version. In a real app, you'd use a routing library.
export function AppTabs({ currentTab, setCurrentTab }: { currentTab: string, setCurrentTab: (tab: string) => void }) {
    const tabs = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Monitor', icon: Activity },
        { name: 'Add Reading', icon: PlusCircle },
        { name: 'History', icon: History },
    ];

    return (
        <div className="border-b border-ui-border mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setCurrentTab(tab.name)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                            currentTab === tab.name
                                ? 'border-primary-blue text-primary-blue'
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-ui-border'
                        }`}
                    >
                        <tab.icon className="h-5 w-5" />
                        <span>{tab.name}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
