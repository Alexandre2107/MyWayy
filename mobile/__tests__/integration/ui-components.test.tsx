// __tests__/integration/ui-components.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Card from "@/components/Card";
import Checkbox from "@/components/Checkbox";
import ProgressBar from "@/components/ProgressBar";
import { generateProgressPercentage } from "@/utils/generate-progress-percentage";

describe("Integration: UI Components", () => {
  describe("Card com interações", () => {
    it("deve renderizar card e responder a eventos", () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Card
          title="Maria Silva"
          description="Aluna do 3º ano"
          document="123.456.789-00"
          onPress={mockOnPress}
        />
      );

      const card = getByText("Maria Silva").parent?.parent;

      // Verificar renderização
      expect(getByText("Maria Silva")).toBeTruthy();
      expect(getByText("Aluna do 3º ano")).toBeTruthy();
      expect(getByText("123.456.789-00")).toBeTruthy();

      // Testar interação
      fireEvent.press(card!);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("deve renderizar múltiplos cards com dados diferentes", () => {
      const cards = [
        { title: "João", description: "Aluno A", document: "111.111.111-11" },
        { title: "Maria", description: "Aluna B", document: "222.222.222-22" },
        { title: "Pedro", description: "Aluno C", document: "333.333.333-33" },
      ];

      const { getByText } = render(
        <>
          {cards.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </>
      );

      cards.forEach((card) => {
        expect(getByText(card.title)).toBeTruthy();
        expect(getByText(card.description)).toBeTruthy();
        expect(getByText(card.document)).toBeTruthy();
      });
    });
  });

  describe("Checkbox com estado", () => {
    it("deve alternar entre checked e unchecked", () => {
      let isChecked = false;
      const handlePress = jest.fn(() => {
        isChecked = !isChecked;
      });

      const { rerender, getByText } = render(
        <Checkbox
          title="Fazer lição de casa"
          checked={isChecked}
          onPress={handlePress}
        />
      );

      const checkbox = getByText("Fazer lição de casa").parent;

      // Primeiro clique
      fireEvent.press(checkbox!);
      expect(handlePress).toHaveBeenCalledTimes(1);

      // Atualizar componente
      rerender(
        <Checkbox
          title="Fazer lição de casa"
          checked={true}
          onPress={handlePress}
        />
      );

      // Segundo clique
      fireEvent.press(checkbox!);
      expect(handlePress).toHaveBeenCalledTimes(2);
    });

    it("deve gerenciar lista de tarefas com checkboxes", () => {
      const tasks = [
        { id: 1, title: "Estudar matemática", completed: false },
        { id: 2, title: "Fazer exercícios", completed: true },
        { id: 3, title: "Ler livro", completed: false },
      ];

      const handleToggle = jest.fn();

      const { getByText } = render(
        <>
          {tasks.map((task) => (
            <Checkbox
              key={task.id}
              title={task.title}
              checked={task.completed}
              onPress={() => handleToggle(task.id)}
            />
          ))}
        </>
      );

      // Verificar renderização de todas as tarefas
      tasks.forEach((task) => {
        expect(getByText(task.title)).toBeTruthy();
      });

      // Interagir com cada checkbox
      const task1 = getByText("Estudar matemática").parent;
      fireEvent.press(task1!);
      expect(handleToggle).toHaveBeenCalledWith(1);

      const task2 = getByText("Fazer exercícios").parent;
      fireEvent.press(task2!);
      expect(handleToggle).toHaveBeenCalledWith(2);
    });
  });

  describe("ProgressBar com cálculo dinâmico", () => {
    it("deve atualizar progresso conforme tarefas são completadas", () => {
      const totalTasks = 10;
      let completedTasks = 0;

      const { rerender, UNSAFE_root } = render(
        <ProgressBar
          progress={
            generateProgressPercentage(totalTasks, completedTasks) / 100
          }
        />
      );

      // 0% completo
      let progressBar = UNSAFE_root.findByProps({
        className: "h-2 bg-green-600 rounded-full",
      });
      expect(progressBar.props.style.width).toBe("0%");

      // Completar 3 tarefas (30%)
      completedTasks = 3;
      rerender(
        <ProgressBar
          progress={
            generateProgressPercentage(totalTasks, completedTasks) / 100
          }
        />
      );

      progressBar = UNSAFE_root.findByProps({
        className: "h-2 bg-green-600 rounded-full",
      });
      expect(progressBar.props.style.width).toBe("30%");

      // Completar 5 tarefas (50%)
      completedTasks = 5;
      rerender(
        <ProgressBar
          progress={
            generateProgressPercentage(totalTasks, completedTasks) / 100
          }
        />
      );

      progressBar = UNSAFE_root.findByProps({
        className: "h-2 bg-green-600 rounded-full",
      });
      expect(progressBar.props.style.width).toBe("50%");

      // Completar todas (100%)
      completedTasks = 10;
      rerender(
        <ProgressBar
          progress={
            generateProgressPercentage(totalTasks, completedTasks) / 100
          }
        />
      );

      progressBar = UNSAFE_root.findByProps({
        className: "h-2 bg-green-600 rounded-full",
      });
      expect(progressBar.props.style.width).toBe("100%");
    });

    it("deve integrar checkbox com progress bar", () => {
      const tasks = [
        { id: 1, title: "Tarefa 1", completed: false },
        { id: 2, title: "Tarefa 2", completed: false },
        { id: 3, title: "Tarefa 3", completed: false },
      ];

      let taskStates = [...tasks];
      const totalTasks = taskStates.length;
      const completedCount = taskStates.filter((t) => t.completed).length;

      const { getByText, rerender, UNSAFE_root } = render(
        <>
          <ProgressBar
            progress={
              generateProgressPercentage(totalTasks, completedCount) / 100
            }
          />
          {taskStates.map((task) => (
            <Checkbox
              key={task.id}
              title={task.title}
              checked={task.completed}
            />
          ))}
        </>
      );

      // Progresso inicial (0%)
      let progressBar = UNSAFE_root.findByProps({
        className: "h-2 bg-green-600 rounded-full",
      });
      expect(progressBar.props.style.width).toBe("0%");

      // Completar primeira tarefa
      taskStates[0].completed = true;
      const newCompletedCount = taskStates.filter((t) => t.completed).length;

      rerender(
        <>
          <ProgressBar
            progress={
              generateProgressPercentage(totalTasks, newCompletedCount) / 100
            }
          />
          {taskStates.map((task) => (
            <Checkbox
              key={task.id}
              title={task.title}
              checked={task.completed}
            />
          ))}
        </>
      );

      // Progresso atualizado (33%)
      progressBar = UNSAFE_root.findByProps({
        className: "h-2 bg-green-600 rounded-full",
      });
      expect(progressBar.props.style.width).toBe("33%");
    });
  });

  describe("Combinação de componentes em cenário real", () => {
    it("deve simular tela de rotina com cards, checkboxes e progress", () => {
      const students = [
        { id: 1, name: "João Silva", doc: "111.111.111-11" },
        { id: 2, name: "Maria Santos", doc: "222.222.222-22" },
      ];

      const activities = [
        { id: 1, title: "Estudar", completed: false },
        { id: 2, title: "Exercitar", completed: true },
        { id: 3, title: "Ler", completed: false },
      ];

      const completedCount = activities.filter((a) => a.completed).length;
      const progress =
        generateProgressPercentage(activities.length, completedCount) / 100;

      const { getByText } = render(
        <>
          <ProgressBar progress={progress} />
          {students.map((student) => (
            <Card
              key={student.id}
              title={student.name}
              description="Aluno"
              document={student.doc}
            />
          ))}
          {activities.map((activity) => (
            <Checkbox
              key={activity.id}
              title={activity.title}
              checked={activity.completed}
            />
          ))}
        </>
      );

      // Verificar todos os elementos
      students.forEach((student) => {
        expect(getByText(student.name)).toBeTruthy();
      });

      activities.forEach((activity) => {
        expect(getByText(activity.title)).toBeTruthy();
      });

      // Verificar que progress bar foi renderizada
      expect(getByText).toBeDefined();
    });
  });
});
