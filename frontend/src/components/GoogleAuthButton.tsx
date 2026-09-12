import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Modal } from './Modal';
import { Key, ExternalLink, CheckCircle2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  role?: string;
  onSuccess: (role: string) => void;
  onError: (errorMessage: string) => void;
  text?: 'signin' | 'signup';
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  role,
  onSuccess,
  onError,
  text = 'signin',
}) => {
  const { googleLogin } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Read client ID from Vite env or local test override
  const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [overrideClientId, setOverrideClientId] = useState<string>(
    () => localStorage.getItem('google_oauth_client_id') || ''
  );
  const [inputClientId, setInputClientId] = useState('');

  const activeClientId = overrideClientId || envClientId;
  const isValidClientId =
    Boolean(activeClientId) &&
    activeClientId !== 'your_google_client_id_here' &&
    activeClientId.includes('.apps.googleusercontent.com');

  const handleCredentialSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      onError('Google did not return an authentication credential.');
      return;
    }

    try {
      const { role: userRole } = await googleLogin({
        credential: credentialResponse.credential,
        role,
      });
      onSuccess(userRole);
    } catch (err: any) {
      onError(err.response?.data?.message || 'Google authentication failed on server.');
    }
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputClientId.trim()) return;

    const trimmed = inputClientId.trim();
    localStorage.setItem('google_oauth_client_id', trimmed);
    setOverrideClientId(trimmed);
    setShowConfigModal(false);
  };

  return (
    <div className="w-full">
      {isValidClientId ? (
        <div className="flex justify-center w-full min-h-[44px]">
          <GoogleOAuthProvider clientId={activeClientId}>
            <GoogleLogin
              onSuccess={handleCredentialSuccess}
              onError={() => onError('Google Authentication was cancelled or failed.')}
              useOneTap={false}
              theme="outline"
              size="large"
              shape="pill"
              text={text === 'signup' ? 'signup_with' : 'continue_with'}
              width="380"
            />
          </GoogleOAuthProvider>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowConfigModal(true)}
          className="tactile-btn w-full py-2.5 rounded-lg bg-[var(--bg-main)] text-[var(--text-main)] text-xs font-bold flex items-center justify-center gap-2.5 transition-all group"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>{text === 'signup' ? 'Register with Google Account' : 'Continue with Google Account'}</span>
        </button>
      )}

      {/* Configuration Guide Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Google OAuth Setup Required"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <Key className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Real Google OAuth 2.0 Credentials</p>
              <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                To trigger the genuine Google Account picker popup in your browser, a Google Client ID from Google Cloud Console is needed.
              </p>
            </div>
          </div>

          <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Quick 2-Minute Setup Steps:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>
                Open the{' '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-500 underline font-semibold inline-flex items-center gap-0.5"
                >
                  Google Cloud Console Credentials <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>Click <strong>+ CREATE CREDENTIALS</strong> &gt; <strong>OAuth client ID</strong>.</li>
              <li>Select Application type: <strong>Web application</strong>.</li>
              <li>
                Under <em>Authorized JavaScript origins</em>, add:
                <code className="ml-1 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono text-[11px] text-amber-600 dark:text-amber-400">
                  http://localhost:5173
                </code>
              </li>
              <li>Copy your resulting <strong>Client ID</strong> (ends with <code>.apps.googleusercontent.com</code>).</li>
            </ol>
          </div>

          <form onSubmit={handleSaveClientId} className="space-y-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Paste Google Client ID here to activate immediately:
              </label>
              <input
                type="text"
                placeholder="xxxx-xxxxxxxx.apps.googleusercontent.com"
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-amber-500 focus:outline-none placeholder:text-slate-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                You can also permanently save it in <code>frontend/.env</code> as <code>VITE_GOOGLE_CLIENT_ID</code> and <code>backend/.env</code> as <code>GOOGLE_CLIENT_ID</code>.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={!inputClientId.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm disabled:opacity-50"
              >
                Save &amp; Activate Google Login
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
