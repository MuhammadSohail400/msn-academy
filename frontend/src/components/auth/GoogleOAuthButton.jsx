import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { googleLoginUser } from '../../features/auth/slice/authSlice';

export default function GoogleOAuthButton({ onError, buttonText = 'Continue with Google' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [isLoading, setIsLoading] = useState(false);
  const [gisReady, setGisReady] = useState(false);
  const googleBtnContainerRef = useRef(null);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) {
      if (onError) onError('No credential received from Google.');
      return;
    }

    setIsLoading(true);
    if (onError) onError('');

    try {
      await dispatch(googleLoginUser(response.credential)).unwrap();
      navigate(redirectPath);
    } catch (err) {
      const message = typeof err === 'string' ? err : err?.message || 'Google sign-in failed. Please try again.';
      if (onError) onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasInitializedRef = useRef(false);
  const handleCredentialResponseRef = useRef(handleGoogleCredentialResponse);
  handleCredentialResponseRef.current = handleGoogleCredentialResponse;

  useEffect(() => {
    if (!clientId) return;

    const initializeGoogleSignIn = () => {
      if (hasInitializedRef.current) return;
      if (window.google?.accounts?.id && googleBtnContainerRef.current) {
        try {
          hasInitializedRef.current = true;
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (res) => handleCredentialResponseRef.current(res),
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render Google's official sign-in button
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 380,
            logo_alignment: 'left',
          });

          setGisReady(true);
        } catch (err) {
          console.error('Failed to initialize Google Identity Services:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initializeGoogleSignIn();
        }
      }, 150);
      return () => clearInterval(interval);
    }
  }, [clientId]);

  const handleCustomButtonClick = async () => {
    if (!clientId) {
      // In development mode, provide instant test sign-in if no client ID is provided yet
      if (import.meta.env.DEV) {
        setIsLoading(true);
        if (onError) onError('');
        try {
          await dispatch(googleLoginUser('mock_google_token')).unwrap();
          navigate(redirectPath);
        } catch (err) {
          const message = typeof err === 'string' ? err : err?.message || 'Dev mock Google sign-in failed.';
          if (onError) onError(message);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      if (onError) {
        onError('Google Client ID is not configured. Please add VITE_GOOGLE_CLIENT_ID to your frontend .env file.');
      }
      return;
    }

    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
      } catch (err) {
        console.error('Error prompting Google sign-in:', err);
      }
    } else {
      if (onError) onError('Google Identity Services library is still loading. Please wait a moment.');
    }
  };

  return (
    <div className="w-full">
      {/* If Client ID is active and GIS rendered the official button, show it */}
      {clientId && (
        <div
          ref={googleBtnContainerRef}
          className={`w-full flex justify-center min-h-[44px] ${!gisReady ? 'hidden' : ''}`}
        />
      )}

      {/* Branded fallback button shown when GIS is loading or clientId is not yet configured */}
      {(!clientId || !gisReady) && (
        <button
          type="button"
          disabled={isLoading}
          onClick={handleCustomButtonClick}
          className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand-crimson" />
          ) : (
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{isLoading ? 'Connecting to Google...' : buttonText}</span>
        </button>
      )}
    </div>
  );
}

