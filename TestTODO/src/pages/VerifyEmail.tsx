import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const hasVerified = React.useRef(false);

    useEffect(() => {
        if (!token || hasVerified.current) return;

        hasVerified.current = true;
        const verify = async () => {
            try {
                await api.get(`/auth/verify/${token}`);
                setStatus('success');
            } catch (error) {
                setStatus('error');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
                    </div>
                )}
                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                        <p className="text-gray-600 mb-6">Your account has been successfully verified.</p>
                        <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-500">
                            Proceed to Login
                        </Link>
                    </div>
                )}
                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <XCircle className="w-16 h-16 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-6">The verification link is invalid or has expired.</p>
                        <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-500">
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
