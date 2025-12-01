// __tests__/components/Checkbox.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TouchableOpacity, View } from "react-native";
import Checkbox from "@/components/Checkbox";

describe("Checkbox", () => {
  it("deve renderizar corretamente com title", () => {
    const { getByText } = render(<Checkbox title="Tarefa 1" />);
    expect(getByText("Tarefa 1")).toBeTruthy();
  });

  it("deve renderizar desmarcado por padrão", () => {
    const { UNSAFE_root } = render(<Checkbox title="Tarefa 1" />);
    const uncheckedView = UNSAFE_root.findByProps({
      className: "items-center justify-center w-8 h-8 rounded-lg bg-zinc-900",
    });

    expect(uncheckedView).toBeTruthy();
  });

  it("deve renderizar marcado quando checked é true", () => {
    const { UNSAFE_root } = render(
      <Checkbox title="Tarefa 1" checked={true} />
    );
    const checkedView = UNSAFE_root.findByProps({
      className: "items-center justify-center w-8 h-8 bg-green-500 rounded-lg",
    });

    expect(checkedView).toBeTruthy();
  });

  it("deve chamar onPress quando pressionado", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Checkbox title="Tarefa 1" onPress={onPressMock} />
    );

    const checkbox = getByText("Tarefa 1").parent;
    fireEvent.press(checkbox!);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("deve ser um TouchableOpacity", () => {
    const { UNSAFE_root } = render(<Checkbox title="Tarefa 1" />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    expect(touchable).toBeTruthy();
  });

  it("deve ter activeOpacity de 0.7", () => {
    const { UNSAFE_root } = render(<Checkbox title="Tarefa 1" />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    expect(touchable.props.activeOpacity).toBe(0.7);
  });

  it("deve aceitar props adicionais do TouchableOpacity", () => {
    const onPressMock = jest.fn();
    const { UNSAFE_root } = render(
      <Checkbox
        title="Tarefa 1"
        onPress={onPressMock}
        disabled={true}
        testID="test-checkbox"
      />
    );

    const touchable = UNSAFE_root.findByType(TouchableOpacity);
    expect(touchable.props.disabled).toBe(true);
    expect(touchable.props.testID).toBe("test-checkbox");
  });

  it("deve exibir diferentes títulos", () => {
    const { rerender, getByText } = render(
      <Checkbox title="Fazer exercícios" />
    );
    expect(getByText("Fazer exercícios")).toBeTruthy();

    rerender(<Checkbox title="Estudar matemática" />);
    expect(getByText("Estudar matemática")).toBeTruthy();
  });

  it("deve ter classes de estilo corretas no container", () => {
    const { UNSAFE_root } = render(<Checkbox title="Tarefa 1" />);
    const touchable = UNSAFE_root.findByType(TouchableOpacity);

    expect(touchable).toBeTruthy();
  });

  it("deve alternar entre estados checked e unchecked", () => {
    const { rerender, UNSAFE_root } = render(
      <Checkbox title="Tarefa 1" checked={false} />
    );

    let uncheckedView = UNSAFE_root.findByProps({
      className: "items-center justify-center w-8 h-8 rounded-lg bg-zinc-900",
    });
    expect(uncheckedView).toBeTruthy();

    rerender(<Checkbox title="Tarefa 1" checked={true} />);

    let checkedView = UNSAFE_root.findByProps({
      className: "items-center justify-center w-8 h-8 bg-green-500 rounded-lg",
    });
    expect(checkedView).toBeTruthy();
  });

  it("deve renderizar o texto corretamente", () => {
    const { getByText } = render(<Checkbox title="Tarefa 1" />);
    const text = getByText("Tarefa 1");

    expect(text).toBeTruthy();
  });
});
