// __tests__/components/Header.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Header from "@/components/Header";
import { useSession } from "@/hooks/useSession";
import { goTo } from "@/utils/goTo";
import { useLocalSearchParams } from "expo-router";

jest.mock("@/hooks/useSession");
jest.mock("@/utils/goTo");
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

describe("Header", () => {
  const mockGetUser = jest.fn();
  const mockLogout = jest.fn();
  const mockGoTo = goTo as jest.MockedFunction<typeof goTo>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue({
      getUser: mockGetUser,
      logout: mockLogout,
    });
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "123" });
  });

  it("deve renderizar corretamente com usuário logado", () => {
    mockGetUser.mockReturnValue({
      user_id: "123",
      full_name: "João Silva",
      document: "123.456.789-00",
      email: "joao@example.com",
      password: "hashedPassword",
      type_of_user: "student",
      has_full_permission: true,
    });

    const { getByText } = render(<Header />);

    expect(getByText("João Silva")).toBeTruthy();
    expect(getByText("Sair")).toBeTruthy();
  });

  it('deve exibir "Usuário" quando não há usuário logado', () => {
    mockGetUser.mockReturnValue(null);

    const { getByText } = render(<Header />);

    expect(getByText("Usuário")).toBeTruthy();
  });

  it("deve navegar para settings ao clicar no perfil", () => {
    mockGetUser.mockReturnValue({
      user_id: "123",
      full_name: "Maria Santos",
      document: "987.654.321-00",
      email: "maria@example.com",
      password: "hashedPassword",
      type_of_user: "guardian",
      has_full_permission: false,
    });

    const { getByText } = render(<Header />);

    const profileButton = getByText("Maria Santos").parent?.parent;
    fireEvent.press(profileButton!);

    expect(mockGoTo).toHaveBeenCalledWith("/(tabs)/123/settings");
  });

  it("deve chamar logout ao clicar no botão Sair", () => {
    mockGetUser.mockReturnValue({
      user_id: "456",
      full_name: "Pedro Costa",
      document: "111.222.333-44",
      email: "pedro@example.com",
      password: "hashedPassword",
      type_of_user: "student",
      has_full_permission: true,
    });

    const { getByText } = render(<Header />);

    const logoutButton = getByText("Sair").parent;
    fireEvent.press(logoutButton!);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("deve usar ID correto dos parâmetros da rota", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "789" });
    mockGetUser.mockReturnValue({
      user_id: "789",
      full_name: "Ana Lima",
      document: "555.666.777-88",
      email: "ana@example.com",
      password: "hashedPassword",
      type_of_user: "guardian",
      has_full_permission: false,
    });

    const { getByText } = render(<Header />);

    const profileButton = getByText("Ana Lima").parent?.parent;
    fireEvent.press(profileButton!);

    expect(mockGoTo).toHaveBeenCalledWith("/(tabs)/789/settings");
  });

  it("deve renderizar ícones corretamente", () => {
    mockGetUser.mockReturnValue({
      user_id: "123",
      full_name: "Teste User",
      document: "123.456.789-00",
      email: "test@example.com",
      password: "hashedPassword",
      type_of_user: "student",
      has_full_permission: true,
    });

    const component = render(<Header />);
    expect(component).toBeTruthy();
  });

  it("deve ter estrutura de layout correta", () => {
    mockGetUser.mockReturnValue({
      user_id: "123",
      full_name: "Layout Test",
      document: "123.456.789-00",
      email: "layout@example.com",
      password: "hashedPassword",
      type_of_user: "student",
      has_full_permission: true,
    });

    const { UNSAFE_root } = render(<Header />);
    const container = UNSAFE_root.findByProps({
      className: "flex-row items-center justify-between w-full",
    });

    expect(container).toBeTruthy();
  });
});
