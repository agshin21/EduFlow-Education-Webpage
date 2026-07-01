import { useEffect, useState } from "react";

import type { AppUser } from "../@types/types";
import { getCurrentUser } from "../services/authService";

const readUserFromStorage = (): AppUser | null => getCurrentUser();

export const useCurrentUser = (): AppUser | null => {
  const [user, setUser] = useState<AppUser | null>(() => readUserFromStorage());

  useEffect(() => {
    const sync = () => setUser(readUserFromStorage());
    window.addEventListener("storage", sync);
    window.addEventListener("auth-change", sync);
    const interval = window.setInterval(sync, 1000);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-change", sync);
      window.clearInterval(interval);
    };
  }, []);

  return user;
};