// ============================================================
// AUTH HELPERS — shared across login.html, register.html, and
// every dashboard page. Requires firebase-config.js loaded first.
// ============================================================

function showAuthError(msg){
  const el = document.getElementById('auth-error');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearAuthError(){
  const el = document.getElementById('auth-error');
  if (el) el.classList.add('hidden');
}

function friendlyError(code){
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'That email address looks invalid.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.'
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// ---------- Sign up ----------
function signUpWithEmail(name, email, password){
  return auth.createUserWithEmailAndPassword(email, password)
    .then(cred => cred.user.updateProfile({ displayName: name }));
}

// ---------- Log in ----------
function signInWithEmail(email, password){
  return auth.signInWithEmailAndPassword(email, password);
}

// ---------- Social sign-in ----------
function signInWithGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
}

function signInWithGithub(){
  const provider = new firebase.auth.GithubAuthProvider();
  return auth.signInWithPopup(provider);
}

// ---------- Log out ----------
function signOutUser(){
  return auth.signOut().then(() => { window.location.href = 'login.html'; });
}

// ---------- Route guard for dashboard pages ----------
// Call this at the top of any protected page. Redirects to login
// if no user is signed in, and fills in the sidebar profile card.
function requireAuth(onReady){
  auth.onAuthStateChanged(user => {
    if (!user){
      window.location.href = 'login.html';
      return;
    }
    const nameEls = document.querySelectorAll('[data-user-name]');
    const emailEls = document.querySelectorAll('[data-user-email]');
    const initialEls = document.querySelectorAll('[data-user-initial]');
    const displayName = user.displayName || user.email.split('@')[0];
    nameEls.forEach(el => el.textContent = displayName);
    emailEls.forEach(el => el.textContent = user.email);
    initialEls.forEach(el => el.textContent = displayName.charAt(0).toUpperCase());
    if (typeof onReady === 'function') onReady(user);
  });
}
