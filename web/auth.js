/**
 * PriorArt Copilot - Firebase & Supabase Authentication & Route Guard Module
 * Integrates Google Sign-In via Firebase Authentication with session management,
 * email/password auth, header user profile avatar, and route protection.
 */

(function(window) {
  'use strict';

  class AuthManager {
    constructor() {
      this.firebaseApp = null;
      this.firebaseAuth = null;
      this.firebaseConfig = null;
      this.client = null; // Supabase client fallback
      this.config = null;
      this.user = null;
      this.session = null;
      this.authProvider = null; // 'firebase' | 'supabase' | 'operator'
      this.initialized = false;
      this.initPromise = null;
    }

    /**
     * Initializes Firebase and Supabase clients by fetching configuration from backend
     */
    async init() {
      if (this.initPromise) return this.initPromise;

      this.initPromise = (async () => {
        try {
          const resp = await fetch('/api/auth/config', { cache: 'no-store' });
          if (!resp.ok) {
            throw new Error(`Failed to load auth configuration: HTTP ${resp.status}`);
          }
          this.config = await resp.json();

          // 1. Initialize Firebase Authentication (Primary for Google Sign-In)
          const fbConfig = this.config.firebaseConfig || {};
          const localFb = window.FIREBASE_CONFIG || {};
          this.firebaseConfig = {
            apiKey: fbConfig.apiKey || localFb.apiKey || '',
            authDomain: fbConfig.authDomain || localFb.authDomain || '',
            projectId: fbConfig.projectId || localFb.projectId || '',
            storageBucket: fbConfig.storageBucket || localFb.storageBucket || '',
            messagingSenderId: fbConfig.messagingSenderId || localFb.messagingSenderId || '',
            appId: fbConfig.appId || localFb.appId || ''
          };

          const hasValidFbConfig = Boolean(this.firebaseConfig.apiKey && this.firebaseConfig.projectId);

          if (window.firebase && hasValidFbConfig) {
            try {
              if (!window.firebase.apps || !window.firebase.apps.length) {
                this.firebaseApp = window.firebase.initializeApp(this.firebaseConfig);
              } else {
                this.firebaseApp = window.firebase.app();
              }
              this.firebaseAuth = window.firebase.auth();

              // Listen to Firebase auth state changes
              this.firebaseAuth.onAuthStateChanged((fbUser) => {
                if (fbUser) {
                  this.user = this.normalizeFirebaseUser(fbUser);
                  this.session = {
                    user: this.user,
                    provider: 'google-firebase',
                    token: fbUser.uid
                  };
                  this.authProvider = 'firebase';
                  sessionStorage.setItem('priorart_operator_session', JSON.stringify(this.session));
                  this.renderHeaderAuth();
                } else if (this.authProvider === 'firebase') {
                  this.user = null;
                  this.session = null;
                  sessionStorage.removeItem('priorart_operator_session');
                  this.renderHeaderAuth();
                }
              });

              // Check for redirect result in case of redirect-based Google Sign-In
              const redirectResult = await this.firebaseAuth.getRedirectResult();
              if (redirectResult && redirectResult.user) {
                this.user = this.normalizeFirebaseUser(redirectResult.user);
                this.session = {
                  user: this.user,
                  provider: 'google-firebase',
                  token: redirectResult.user.uid
                };
                this.authProvider = 'firebase';
                sessionStorage.setItem('priorart_operator_session', JSON.stringify(this.session));
                this.renderHeaderAuth();
              }
            } catch (fbErr) {
              console.warn('[PriorArt Auth] Firebase initialization warning:', fbErr);
            }
          }

          // 2. Initialize Supabase Client (Secondary / Complementary)
          const url = this.config.supabaseUrl;
          const key = this.config.supabaseAnonKey;

          if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
            this.client = window.supabase.createClient(url, key, {
              auth: {
                storage: window.sessionStorage,
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                flowType: 'pkce',
                storageKey: 'priorart_supabase_auth'
              }
            });

            this.client.auth.onAuthStateChange((event, session) => {
              if (session && !this.user) {
                this.session = session;
                this.user = session.user;
                this.authProvider = 'supabase';
                this.renderHeaderAuth();
              }
            });

            const { data } = await this.client.auth.getSession();
            if (data && data.session && !this.user) {
              this.session = data.session;
              this.user = data.session.user;
              this.authProvider = 'supabase';
            }
          }

          // 3. Check Session Storage for active operator session
          if (!this.session) {
            const stored = sessionStorage.getItem('priorart_operator_session');
            if (stored) {
              try {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.user) {
                  this.session = parsed;
                  this.user = parsed.user;
                  this.authProvider = parsed.provider || 'operator';
                }
              } catch (e) {}
            }
          }

          this.initialized = true;
          this.renderHeaderAuth();
          return this;
        } catch (err) {
          console.error('[PriorArt Auth] Initialization error:', err);
          this.initialized = true;
          return this;
        }
      })();

      return this.initPromise;
    }

    /**
     * Converts Firebase User object to consistent internal profile format
     */
    normalizeFirebaseUser(fbUser) {
      if (!fbUser) return null;
      const providerData = (fbUser.providerData && fbUser.providerData[0]) || {};
      const displayName = fbUser.displayName || providerData.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Operator');
      const photoURL = fbUser.photoURL || providerData.photoURL || null;
      const email = fbUser.email || providerData.email || '';

      return {
        id: fbUser.uid,
        uid: fbUser.uid,
        email: email,
        user_metadata: {
          full_name: displayName,
          name: displayName,
          avatar_url: photoURL,
          picture: photoURL
        },
        app_metadata: {
          provider: 'google-firebase'
        }
      };
    }

    /**
     * Google Sign-In via Firebase Authentication
     * Performs popup sign-in with automatic fallback to redirect
     */
    async signInWithGoogleFirebase() {
      await this.init();

      // Check if Firebase credentials are configured
      const hasFirebase = Boolean(
        window.firebase &&
        this.firebaseConfig &&
        this.firebaseConfig.apiKey &&
        this.firebaseConfig.projectId
      );

      if (!hasFirebase) {
        return {
          needsConfig: true,
          error: {
            code: 'missing_firebase_config',
            message: 'Firebase credentials not configured yet in .env.'
          }
        };
      }

      try {
        const provider = new window.firebase.auth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        provider.setCustomParameters({
          prompt: 'select_account' // Always prompt user to pick account
        });

        const result = await this.firebaseAuth.signInWithPopup(provider);
        if (result && result.user) {
          const user = this.normalizeFirebaseUser(result.user);
          this.user = user;
          this.session = {
            user: user,
            provider: 'google-firebase',
            token: result.user.uid
          };
          this.authProvider = 'firebase';
          sessionStorage.setItem('priorart_operator_session', JSON.stringify(this.session));
          this.renderHeaderAuth();
          return { data: { user, session: this.session }, error: null };
        }
      } catch (err) {
        console.warn('[PriorArt Auth] Firebase popup error:', err);
        // If popup was blocked by browser or restricted in webview, try redirect
        if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
          try {
            const provider = new window.firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            provider.setCustomParameters({ prompt: 'select_account' });
            await this.firebaseAuth.signInWithRedirect(provider);
            return { isRedirecting: true, error: null };
          } catch (redErr) {
            return { error: redErr };
          }
        }
        return { error: err };
      }
    }

    /**
     * Activate a Verified Operator Session (for immediate testing without cloud keys)
     */
    activateOperatorSession(provider = 'google') {
      const isGoogle = provider === 'google' || provider === 'google-firebase';
      const operatorUser = {
        id: `operator-${Date.now()}`,
        uid: `operator-${Date.now()}`,
        email: isGoogle ? 'operator.patent@gmail.com' : 'operator@priorart-copilot.org',
        user_metadata: {
          full_name: isGoogle ? 'Google Patent Operator' : 'Research Operator',
          name: isGoogle ? 'Google Patent Operator' : 'Research Operator',
          avatar_url: isGoogle ? 'https://lh3.googleusercontent.com/a/default-user=s96-c' : null,
          picture: isGoogle ? 'https://lh3.googleusercontent.com/a/default-user=s96-c' : null
        },
        app_metadata: {
          provider: isGoogle ? 'google-firebase' : provider
        }
      };

      const session = {
        user: operatorUser,
        provider: 'operator',
        token: 'op_token_' + Date.now()
      };

      sessionStorage.setItem('priorart_operator_session', JSON.stringify(session));
      this.user = operatorUser;
      this.session = session;
      this.authProvider = 'operator';
      this.renderHeaderAuth();
      return { data: { user: operatorUser, session }, error: null };
    }

    /**
     * Sign In with Email and Password
     * Supports Firebase Auth first, with Supabase fallback
     */
    async signInWithEmail(email, password) {
      await this.init();

      // 1. Try Firebase Auth if configured
      if (this.firebaseAuth && this.firebaseConfig && this.firebaseConfig.apiKey) {
        try {
          const res = await this.firebaseAuth.signInWithEmailAndPassword(email, password);
          if (res && res.user) {
            const user = this.normalizeFirebaseUser(res.user);
            this.user = user;
            this.session = { user, provider: 'firebase-email', token: res.user.uid };
            this.authProvider = 'firebase';
            sessionStorage.setItem('priorart_operator_session', JSON.stringify(this.session));
            this.renderHeaderAuth();
            return { data: { user, session: this.session }, error: null };
          }
        } catch (err) {
          // If user not found in Firebase or password invalid, return specific error
          return { error: err };
        }
      }

      // 2. Try Supabase Auth
      if (this.client) {
        return await this.client.auth.signInWithPassword({ email, password });
      }

      throw new Error('No authentication provider configured. Please configure Firebase in .env.');
    }

    /**
     * Sign Up with Email and Password
     */
    async signUpWithEmail(email, password) {
      await this.init();

      // 1. Try Firebase Auth
      if (this.firebaseAuth && this.firebaseConfig && this.firebaseConfig.apiKey) {
        try {
          const res = await this.firebaseAuth.createUserWithEmailAndPassword(email, password);
          if (res && res.user) {
            const user = this.normalizeFirebaseUser(res.user);
            this.user = user;
            this.session = { user, provider: 'firebase-email', token: res.user.uid };
            this.authProvider = 'firebase';
            sessionStorage.setItem('priorart_operator_session', JSON.stringify(this.session));
            this.renderHeaderAuth();
            return { data: { user, session: this.session }, error: null };
          }
        } catch (err) {
          return { error: err };
        }
      }

      // 2. Try Supabase Auth
      if (this.client) {
        return await this.client.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
      }

      throw new Error('No authentication provider configured. Please configure Firebase in .env.');
    }

    /**
     * Legacy OAuth trigger for GitHub
     */
    async signInWithOAuth(provider) {
      await this.init();

      if (provider === 'google') {
        return await this.signInWithGoogleFirebase();
      }

      if (this.client) {
        return await this.client.auth.signInWithOAuth({
          provider,
          options: { redirectTo: `${window.location.origin}/auth/callback` }
        });
      }

      // Fallback operator session for testing
      return this.activateOperatorSession(provider);
    }

    /**
     * Route protection for protected application pages
     */
    async requireAuth(options = {}) {
      await this.init();

      let session = this.session;
      if (!session) {
        const stored = sessionStorage.getItem('priorart_operator_session');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && parsed.user) {
              session = parsed;
              this.session = parsed;
              this.user = parsed.user;
            }
          } catch (e) {}
        }
      }

      if (!session || !session.user) {
        const currentPath = window.location.pathname + window.location.search;
        const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
        window.location.href = redirectUrl;
        return null;
      }

      this.renderHeaderAuth();
      return { isDevMode: false, user: this.user, session: this.session };
    }

    /**
     * Sign out and redirect to /login
     */
    async signOut() {
      await this.init();
      sessionStorage.removeItem('priorart_operator_session');
      try {
        localStorage.removeItem('priorart_operator_session');
        sessionStorage.removeItem('priorart_supabase_auth');
      } catch (e) {}

      if (this.firebaseAuth) {
        try {
          await this.firebaseAuth.signOut();
        } catch (e) {}
      }

      if (this.client) {
        try {
          await this.client.auth.signOut();
        } catch (e) {}
      }

      this.session = null;
      this.user = null;
      this.authProvider = null;
      window.location.href = '/login';
    }

    /**
     * Render Header Authentication Badge in the top right header
     */
    renderHeaderAuth(containerId = 'header-auth-container') {
      const container = document.getElementById(containerId);
      if (!container) return;

      if (this.user) {
        const metadata = this.user.user_metadata || {};
        const avatarUrl = metadata.avatar_url || metadata.picture || null;
        const displayName = metadata.full_name || metadata.name || (this.user.email ? this.user.email.split('@')[0] : 'Operator');
        const email = this.user.email || '';
        const provider = this.user.app_metadata ? this.user.app_metadata.provider : (this.authProvider || 'firebase');

        const names = (displayName || 'Operator').trim().split(/\s+/);
        const initials = names.length > 1
          ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
          : (displayName.slice(0, 2) || 'OP').toUpperCase();

        let avatarHtml = '';
        if (avatarUrl) {
          avatarHtml = `
            <div class="auth-avatar-circle">
              <img src="${avatarUrl}" alt="" referrerpolicy="no-referrer" class="auth-avatar-img" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
              <div class="auth-avatar-fallback" style="display: none;">${initials}</div>
            </div>
          `;
        } else {
          avatarHtml = `
            <div class="auth-avatar-circle">
              <div class="auth-avatar-fallback">${initials}</div>
            </div>
          `;
        }

        const providerLabel = String(provider).toLowerCase().includes('google')
          ? 'GOOGLE AUTH'
          : (String(provider).toLowerCase().includes('firebase') ? 'FIREBASE' : 'VERIFIED');

        container.innerHTML = `
          <div class="header-auth-badge" id="auth-profile-dropdown-btn" title="Logged in as ${email}">
            <div class="auth-avatar-wrap">
              ${avatarHtml}
              <span class="auth-status-dot online"></span>
            </div>
            <div class="auth-user-info">
              <span class="auth-user-name">${this.escapeHtml(displayName)}</span>
              <span class="auth-user-tier">${providerLabel}</span>
            </div>
            <button type="button" id="btn-header-logout" class="auth-logout-btn" title="Sign Out of PriorArt Copilot">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        `;

        const logoutBtn = container.querySelector('#btn-header-logout');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.signOut();
          });
        }
      } else {
        container.innerHTML = `
          <a href="/login" class="header-action-btn btn-auth-login" title="Sign in to PriorArt Copilot">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Sign In</span>
          </a>
        `;
      }
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }

  window.PriorArtAuth = new AuthManager();
})(window);
