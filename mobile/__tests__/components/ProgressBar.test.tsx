// __tests__/components/ProgressBar.test.tsx
import React from "react";
import { render } from "@testing-library/react-native";
import ProgressBar from "@/components/ProgressBar";

describe("ProgressBar", () => {
  it("deve renderizar corretamente", () => {
    const component = render(<ProgressBar progress={0.5} />);
    expect(component).toBeTruthy();
  });

  it("deve exibir 0% de progresso quando progress é 0", () => {
    const component = render(<ProgressBar progress={0} />);
    expect(component).toBeTruthy();
  });

  it("deve exibir 50% de progresso", () => {
    const { UNSAFE_root } = render(<ProgressBar progress={0.5} />);
    const progressView = UNSAFE_root.findAllByProps({
      className: "h-2 bg-green-600 rounded-full",
    })[0];

    expect(progressView.props.style.width).toBe("50%");
  });

  it("deve exibir 100% de progresso", () => {
    const { UNSAFE_root } = render(<ProgressBar progress={1} />);
    const progressView = UNSAFE_root.findAllByProps({
      className: "h-2 bg-green-600 rounded-full",
    })[0];

    expect(progressView.props.style.width).toBe("100%");
  });

  it("deve exibir 75% de progresso", () => {
    const { UNSAFE_root } = render(<ProgressBar progress={0.75} />);
    const progressView = UNSAFE_root.findAllByProps({
      className: "h-2 bg-green-600 rounded-full",
    })[0];

    expect(progressView.props.style.width).toBe("75%");
  });

  it("deve lidar com valores decimais precisos", () => {
    const { UNSAFE_root } = render(<ProgressBar progress={0.3333} />);
    const progressView = UNSAFE_root.findAllByProps({
      className: "h-2 bg-green-600 rounded-full",
    })[0];

    expect(progressView.props.style.width).toBe("33.33%");
  });

  it("deve ter a classe de estilo correto para o container", () => {
    const { UNSAFE_root } = render(<ProgressBar progress={0.5} />);
    const container = UNSAFE_root.findByProps({
      className: "h-2 bg-gray-700 rounded-full w-full my-4",
    });

    expect(container).toBeTruthy();
  });

  it("deve ter a classe de estilo correto para a barra de progresso", () => {
    const { UNSAFE_root } = render(<ProgressBar progress={0.5} />);
    const progressBar = UNSAFE_root.findByProps({
      className: "h-2 bg-green-600 rounded-full",
    });

    expect(progressBar).toBeTruthy();
  });

  it("deve lidar com progresso maior que 1 (100%+)", () => {
    const { UNSAFE_root } = render(<ProgressBar progress={1.5} />);
    const progressView = UNSAFE_root.findAllByProps({
      className: "h-2 bg-green-600 rounded-full",
    })[0];

    // Deveria exibir 150%, embora isso possa sair da barra visualmente
    expect(progressView.props.style.width).toBe("150%");
  });

  it("deve lidar com valores negativos", () => {
    const { UNSAFE_root } = render(<ProgressBar progress={-0.5} />);
    const progressView = UNSAFE_root.findAllByProps({
      className: "h-2 bg-green-600 rounded-full",
    })[0];

    expect(progressView.props.style.width).toBe("-50%");
  });
});
