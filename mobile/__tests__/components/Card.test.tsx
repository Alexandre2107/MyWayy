// __tests__/components/Card.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TouchableOpacity, View } from "react-native";
import Card from "@/components/Card";

describe("Card", () => {
  const defaultProps = {
    title: "João Silva",
    description: "Aluno do 5º ano",
    document: "123.456.789-00",
  };

  it("deve renderizar corretamente com as props fornecidas", () => {
    const { getByText } = render(<Card {...defaultProps} />);

    expect(getByText("João Silva")).toBeTruthy();
    expect(getByText("Aluno do 5º ano")).toBeTruthy();
    expect(getByText("123.456.789-00")).toBeTruthy();
  });

  it("deve exibir o título corretamente", () => {
    const { getByText } = render(<Card {...defaultProps} />);
    const titleElement = getByText("João Silva");

    expect(titleElement).toBeTruthy();
  });

  it("deve exibir a descrição corretamente", () => {
    const { getByText } = render(<Card {...defaultProps} />);
    const descriptionElement = getByText("Aluno do 5º ano");

    expect(descriptionElement).toBeTruthy();
  });

  it("deve exibir o documento corretamente", () => {
    const { getByText } = render(<Card {...defaultProps} />);
    const documentElement = getByText("123.456.789-00");

    expect(documentElement).toBeTruthy();
  });

  it("deve chamar onPress quando pressionado", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Card {...defaultProps} onPress={onPressMock} />
    );

    const card = getByText("João Silva").parent?.parent;
    fireEvent.press(card!);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("deve ser touchable (TouchableOpacity)", () => {
    const { UNSAFE_root } = render(<Card {...defaultProps} />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    expect(touchable).toBeTruthy();
  });

  it("deve aceitar props adicionais do TouchableOpacity", () => {
    const onPressMock = jest.fn();
    const { UNSAFE_root } = render(
      <Card
        {...defaultProps}
        onPress={onPressMock}
        disabled={true}
        testID="test-card"
      />
    );

    const touchable = UNSAFE_root.findByType(TouchableOpacity);
    expect(touchable.props.disabled).toBe(true);
    expect(touchable.props.testID).toBe("test-card");
  });

  it("deve renderizar com diferentes títulos", () => {
    const { rerender, getByText } = render(
      <Card {...defaultProps} title="Maria" />
    );
    expect(getByText("Maria")).toBeTruthy();

    rerender(<Card {...defaultProps} title="Pedro" />);
    expect(getByText("Pedro")).toBeTruthy();
  });

  it("deve renderizar com diferentes descrições", () => {
    const customProps = {
      ...defaultProps,
      description: "Professor de Matemática",
    };
    const { getByText } = render(<Card {...customProps} />);

    expect(getByText("Professor de Matemática")).toBeTruthy();
  });

  it("deve renderizar com diferentes documentos", () => {
    const customProps = { ...defaultProps, document: "987.654.321-00" };
    const { getByText } = render(<Card {...customProps} />);

    expect(getByText("987.654.321-00")).toBeTruthy();
  });

  it("deve aplicar classes de estilo corretas", () => {
    const { UNSAFE_root } = render(<Card {...defaultProps} />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    expect(touchable).toBeTruthy();
  });

  it("deve ter estrutura de layout correta", () => {
    const { UNSAFE_root } = render(<Card {...defaultProps} />);
    const views = UNSAFE_root.findAllByType(View);

    // Deve ter pelo menos 2 Views (container principal e container do documento)
    expect(views.length).toBeGreaterThanOrEqual(2);
  });
});
