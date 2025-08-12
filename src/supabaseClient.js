import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabase;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  // Provide a minimal mock client to avoid crashes in dev/test when env is not configured
  // and to keep UI functional (Auth screen will show but operations will warn).
  // Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY to enable real auth.
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase credentials are not set. Using a mock auth client. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.'
  );
  supabase = {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      onAuthStateChange(_callback) {
        return { data: { subscription: { unsubscribe() {} } }, error: null };
      },
      async signInWithPassword() {
        return { data: null, error: { message: 'Supabase is not configured.' } };
      },
      async signUp() {
        return { data: null, error: { message: 'Supabase is not configured.' } };
      },
      async signOut() {
        return { error: null };
      },
    },
  };
}

export { supabase };
