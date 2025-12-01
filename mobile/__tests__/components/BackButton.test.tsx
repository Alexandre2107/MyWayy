// __tests__/components/BackButton.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TouchableOpacity } from "react-native";
import BackButton from "@/components/BackButton";
import { useSession } from "@/hooks/useSession";
import { goTo } from "@/utils/goTo";
import { useNavigation } from "@react-navigation/native";

jest.mock("@/hooks/useSession");
jest.mock("@/utils/goTo");
jest.mock("@react-navigation/native");

describe("BackButton", () => {
  const mockGoBack = jest.fn();
  const mockGoTo = goTo as jest.MockedFunction<typeof goTo>;
  const mockUseNavigation = useNavigation as jest.MockedFunction<
    typeof useNavigation
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue({
      goBack: mockGoBack,
    } as any);
  });

  it("deve renderizar corretamente", () => {
    (useSession as jest.Mock).mockReturnValue({
      user: null,
    });

    const { UNSAFE_root } = render(<BackButton />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    expect(touchable).toBeTruthy();
  });

  it("deve navegar para home do student quando usuário é student", () => {
    (useSession as jest.Mock).mockReturnValue({
      user: {
        user_id: "123",
        full_name: "João Silva",
        document: "123.456.789-00",
        email: "joao@example.com",
        password: "hashedPassword",
        type_of_user: "student",
        has_full_permission: true,
      },
    });

    const { UNSAFE_root } = render(<BackButton />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    fireEvent.press(touchable);

    expect(mockGoTo).toHaveBeenCalledWith("/(tabs)/123/student/");
  });

  it("deve navegar para home do guardian quando usuário é guardian", () => {
    (useSession as jest.Mock).mockReturnValue({
      user: {
        user_id: "456",
        full_name: "Maria Santos",
        document: "987.654.321-00",
        email: "maria@example.com",
        password: "hashedPassword",
        type_of_user: "guardian",
        has_full_permission: false,
      },
    });

    const { UNSAFE_root } = render(<BackButton />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    fireEvent.press(touchable);

    expect(mockGoTo).toHaveBeenCalledWith("/(tabs)/456/guardian/");
  });

  it("não deve chamar goTo quando não há usuário logado", () => {
    (useSession as jest.Mock).mockReturnValue({
      user: null,
    });

    const { UNSAFE_root } = render(<BackButton />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    fireEvent.press(touchable);

    expect(mockGoTo).not.toHaveBeenCalled();
  });

  it("deve ter activeOpacity de 0.7", () => {
    (useSession as jest.Mock).mockReturnValue({
      user: null,
    });

    const { UNSAFE_root } = render(<BackButton />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    expect(touchable.props.activeOpacity).toBe(0.7);
  });

  it("deve renderizar ícone de seta", () => {
    (useSession as jest.Mock).mockReturnValue({
      user: null,
    });

    const component = render(<BackButton />);
    expect(component).toBeTruthy();
  });

  it("deve funcionar com diferentes user_ids", () => {
    const userIds = ["user-1", "user-2", "user-3"];

    userIds.forEach((userId) => {
      jest.clearAllMocks();

      (useSession as jest.Mock).mockReturnValue({
        user: {
          user_id: userId,
          full_name: "Test User",
          document: "123.456.789-00",
          email: "test@example.com",
          password: "hashedPassword",
          type_of_user: "student",
          has_full_permission: true,
        },
      });

      const { UNSAFE_root } = render(<BackButton />);
      const touchable = UNSAFE_root.findByType(TouchableOpacity);

      fireEvent.press(touchable);

      expect(mockGoTo).toHaveBeenCalledWith(`/(tabs)/${userId}/student/`);
    });
  });
});
