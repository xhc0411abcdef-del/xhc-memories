/**
 * App.tsx — Memory Album Application Root
 * Design: Watercolor Daylight Aesthetic
 * Flow: LockPage (password) → AlbumPage (gallery)
 */

import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LockPage from "./pages/LockPage";
import AlbumPage from "./pages/AlbumPage";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [showAlbum, setShowAlbum] = useState(isAuthenticated);
  const [unlocking, setUnlocking] = useState(false);
  const handleUnlock = () => {
    setUnlocking(true);
    // Brief delay for exit animation
    setTimeout(() => {
      setShowAlbum(true);
      setUnlocking(false);
    }, 400);
  };

  const handleLogout = () => {
    setShowAlbum(false);
  };

  if (showAlbum && isAuthenticated) {
    return <AlbumPage onLogout={handleLogout} />;
  }

  // make sure to consider if you need authentication for certain routes
  return (
    <div className={unlocking ? "slide-out" : ""}>
      <LockPage onUnlock={handleUnlock} />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
