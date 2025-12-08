import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error("Error parseando user de localStorage", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  function login(userData) {
    // 👉 aquí definimos si es "súper"
    const esSuper =
      userData.rol === "ENCARGADO_UNIDAD" ||
      userData.nombre_completo === "Analista_1"; // o por id_funcionario

    const enrichedUser = {
      ...userData,
      esSuper,
    };

    setUser(enrichedUser);
    localStorage.setItem("user", JSON.stringify(enrichedUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  const isAuthenticated = !!user;
  const isSuper = !!user?.esSuper;
  const isStandard = !!user && !user.esSuper;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSuper,     // 👈 para Encargado + Analista_1
        isStandard,  // 👈 para Analistas 2–5
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
