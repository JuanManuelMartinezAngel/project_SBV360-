import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/AuthForm';
import { Questionnaire } from './components/Questionnaire';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/auth';

function App() {
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={user ? <Navigate to="/questionnaire" /> : <AuthForm />} 
        />
        <Route 
          path="/questionnaire" 
          element={user ? <Questionnaire /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;