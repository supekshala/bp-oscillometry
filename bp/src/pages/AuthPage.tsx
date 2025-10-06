import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';

export function AuthPage() {
    const [showLogin, setShowLogin] = useState(true);

    if (showLogin) {
        return <LoginPage onSwitchToRegister={() => setShowLogin(false)} />;
    }

    return <RegisterPage onSwitchToLogin={() => setShowLogin(true)} />;
}
