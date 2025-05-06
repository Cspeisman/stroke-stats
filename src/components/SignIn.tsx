import { useState } from 'react';
import { Button } from '@mui/material';
import { signIn } from "auth-astro/client"

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn();
            // The user will be redirected after sign-in, and the session will be available
            // on the server side. We don't need to handle the session here.
        } catch (error) {
            console.error('Error signing in:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            onClick={handleSignIn}
            disabled={isLoading}
        >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
    );
} 