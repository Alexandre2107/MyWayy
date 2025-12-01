// __tests__/hooks/useSession.test.tsx
import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { SessionProvider, useSession } from "@/hooks/useSession";
import { authenticateUser } from "@/requests/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { IUser } from "@/interface/User";

jest.mock("@/requests/user");
jest.mock("react-native/Libraries/Alert/Alert");

describe("useSession", () => {
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

  it("deve inicializar com user null", () => {
    const { result } = renderHook(() => useSession(), { wrapper });
    expect(result.current.user).toBeNull();
  });

  it("deve retornar false para isLoggedIn quando não há usuário", () => {
    const { result } = renderHook(() => useSession(), { wrapper });
    expect(result.current.isLoggedIn()).toBe(false);
  });

  it("deve fazer login com sucesso", async () => {
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-123",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    let loginResult: IUser | null = null;

    await act(async () => {
      loginResult = await result.current.login(
        "joao@example.com",
        "password123"
      );
    });

    await waitFor(() => {
      expect(loginResult).toEqual(mockUser);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoggedIn()).toBe(true);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(mockUser)
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "token",
      "mock-token-123"
    );
  });

  it("deve retornar null e mostrar alert quando login falha", async () => {
    (authenticateUser as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    let loginResult: IUser | null = null;

    await act(async () => {
      loginResult = await result.current.login(
        "wrong@example.com",
        "wrongpassword"
      );
    });

    await waitFor(() => {
      expect(loginResult).toBeNull();
      expect(result.current.user).toBeNull();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Erro de Login",
      "Ocorreu um erro durante o login."
    );
  });

  it("deve fazer logout e limpar dados", async () => {
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-123",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    await act(async () => {
      await result.current.login("joao@example.com", "password123");
    });

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
      expect(result.current.isLoggedIn()).toBe(false);
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("user");
  });

  it("deve retornar o usuário com getUser", async () => {
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-123",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    await act(async () => {
      await result.current.login("joao@example.com", "password123");
    });

    await waitFor(() => {
      expect(result.current.getUser()).toEqual(mockUser);
    });
  });

  it("deve identificar corretamente tipo student", async () => {
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-123",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    await act(async () => {
      await result.current.login("joao@example.com", "password123");
    });

    await waitFor(() => {
      expect(result.current.isStudent()).toBe(true);
    });
  });

  it("deve identificar corretamente tipo guardian", async () => {
    const guardianUser: IUser = {
      ...mockUser,
      type_of_user: "guardian",
    };

    const mockAuthResponse = {
      user: guardianUser,
      token: "mock-token-456",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    await act(async () => {
      await result.current.login("guardian@example.com", "password123");
    });

    await waitFor(() => {
      expect(result.current.isStudent()).toBe(false);
    });
  });

  it("deve atualizar usuário corretamente", async () => {
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-123",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    await act(async () => {
      await result.current.login("joao@example.com", "password123");
    });

    await act(async () => {
      result.current.updateUser({ full_name: "João Silva Updated" });
    });

    await waitFor(() => {
      expect(result.current.user?.full_name).toBe("João Silva Updated");
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "user",
      expect.stringContaining("João Silva Updated")
    );
  });

  it("deve retornar token correto", async () => {
    const mockAuthResponse = {
      user: mockUser,
      token: "mock-token-xyz",
    };

    (authenticateUser as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

    const { result } = renderHook(() => useSession(), { wrapper });

    await act(async () => {
      await result.current.login("joao@example.com", "password123");
    });

    await waitFor(() => {
      expect(result.current.getToken()).toBe("mock-token-xyz");
    });
  });

  it("deve definir e retornar routineId", () => {
    const { result } = renderHook(() => useSession(), { wrapper });

    act(() => {
      result.current.setRoutine(42);
    });

    expect(result.current.getRoutineId()).toBe(42);
  });

  it("deve carregar usuário do AsyncStorage na inicialização", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockUser)
    );

    const { result } = renderHook(() => useSession(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it("deve lançar erro quando usado fora do SessionProvider", () => {
    // Suprimir o console.error do React para esse teste
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      renderHook(() => useSession());
    }).toThrow("useSession deve ser usado dentro de um SessionProvider");

    consoleError.mockRestore();
  });
});
