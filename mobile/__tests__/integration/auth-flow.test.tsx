// __tests__/integration/auth-flow.test.tsx
import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { SessionProvider, useSession } from "@/hooks/useSession";
import { authenticateUser } from "@/requests/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "@/interface/User";

jest.mock("@/requests/user");

describe("Integration: Authentication Flow", () => {
  const mockUser: IUser = {
    user_id: "123",
    full_name: "João Silva",
    document: "123.456.789-00",
    email: "joao@example.com",
    password: "hashedPassword",
    type_of_user: "student",
    has_full_permission: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider>{children}</SessionProvider>
  );

  it("deve realizar fluxo completo de autenticação: login -> verificar sessão -> logout", async () => {
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-123",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    // Verificar estado inicial
    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn()).toBe(false);

    // Fazer login
    await act(async () => {
      await result.current.login("joao@example.com", "password123");
    });

    // Verificar que usuário está logado
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoggedIn()).toBe(true);
      expect(result.current.getUser()).toEqual(mockUser);
      expect(result.current.getToken()).toBe("mock-token-123");
    });

    // Verificar persistência no AsyncStorage
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(mockUser)
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "token",
      "mock-token-123"
    );

    // Fazer logout
    await act(async () => {
      await result.current.logout();
    });

    // Verificar que usuário foi deslogado
    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isLoggedIn()).toBe(false);
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("user");
  });

  it("deve manter sessão após recarregar (simular persistência)", async () => {
    // Simular que há um usuário salvo no AsyncStorage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockUser)
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    // Aguardar carregamento do AsyncStorage
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoggedIn()).toBe(true);
    });
  });

  it("deve atualizar perfil do usuário mantendo sessão", async () => {
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-123",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    // Fazer login
    await act(async () => {
      await result.current.login("joao@example.com", "password123");
    });

    // Atualizar usuário
    await act(async () => {
      result.current.updateUser({
        full_name: "João Silva Updated",
        email: "joao.updated@example.com",
      });
    });

    // Verificar que dados foram atualizados
    await waitFor(() => {
      expect(result.current.user?.full_name).toBe("João Silva Updated");
      expect(result.current.user?.email).toBe("joao.updated@example.com");
      expect(result.current.isLoggedIn()).toBe(true);
    });

    // Verificar persistência
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "user",
      expect.stringContaining("João Silva Updated")
    );
  });

  it("deve gerenciar múltiplas tentativas de login (falha seguida de sucesso)", async () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    // Primeira tentativa: falha
    (authenticateUser as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    await act(async () => {
      const loginResult = await result.current.login(
        "wrong@example.com",
        "wrongpassword"
      );
      expect(loginResult).toBeNull();
    });

    expect(result.current.isLoggedIn()).toBe(false);

    // Segunda tentativa: sucesso
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-123",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    await act(async () => {
      const loginResult = await result.current.login(
        "joao@example.com",
        "password123"
      );
      expect(loginResult).toEqual(mockUser);
    });

    await waitFor(() => {
      expect(result.current.isLoggedIn()).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it("deve gerenciar tipo de usuário e permissões", async () => {
    // Testar com estudante
    const studentAuthResponse = {
      user: mockUser,
      token: "student-token",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(studentAuthResponse);

    const { result, rerender } = renderHook(() => useSession(), { wrapper });

    await act(async () => {
      await result.current.login("student@example.com", "password123");
    });

    await waitFor(() => {
      expect(result.current.isStudent()).toBe(true);
    });

    // Fazer logout
    await act(async () => {
      await result.current.logout();
    });

    // Testar com guardian
    const guardianUser: IUser = {
      ...mockUser,
      user_id: "456",
      type_of_user: "guardian",
      email: "guardian@example.com",
    };

    const guardianAuthResponse = {
      user: guardianUser,
      token: "guardian-token",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(guardianAuthResponse);

    await act(async () => {
      await result.current.login("guardian@example.com", "password123");
    });

    await waitFor(() => {
      expect(result.current.isStudent()).toBe(false);
      expect(result.current.user?.type_of_user).toBe("guardian");
    });
  });

  it("deve gerenciar rotina do usuário durante sessão", async () => {
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-123",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    // Login
    await act(async () => {
      await result.current.login("joao@example.com", "password123");
    });

    // Definir rotina
    act(() => {
      result.current.setRoutine(99);
    });

    expect(result.current.getRoutineId()).toBe(99);

    // Logout deve manter routineId (baseado no comportamento atual)
    await act(async () => {
      await result.current.logout();
    });

    // routineId ainda existe mesmo após logout (conforme implementação atual)
    expect(result.current.getRoutineId()).toBe(99);
  });
});
