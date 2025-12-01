// __tests__/utils/generate-progress-percentage.test.ts
import { generateProgressPercentage } from '@/utils/generate-progress-percentage';

describe('generateProgressPercentage', () => {
  it('deve calcular a porcentagem corretamente para valores normais', () => {
    expect(generateProgressPercentage(10, 5)).toBe(50);
    expect(generateProgressPercentage(100, 75)).toBe(75);
    expect(generateProgressPercentage(4, 3)).toBe(75);
  });

  it('deve retornar 0 quando amount é 0', () => {
    expect(generateProgressPercentage(0, 0)).toBe(0);
  });

  it('deve retornar 0 quando completed é 0', () => {
    expect(generateProgressPercentage(10, 0)).toBe(0);
  });

  it('deve retornar 100 quando completed é igual a amount', () => {
    expect(generateProgressPercentage(10, 10)).toBe(100);
    expect(generateProgressPercentage(7, 7)).toBe(100);
  });

  it('deve arredondar corretamente', () => {
    expect(generateProgressPercentage(3, 1)).toBe(33); // 33.333... arredonda para 33
    expect(generateProgressPercentage(3, 2)).toBe(67); // 66.666... arredonda para 67
    expect(generateProgressPercentage(7, 5)).toBe(71); // 71.428... arredonda para 71
  });

  it('deve usar valores padrão quando nenhum parâmetro é fornecido', () => {
    expect(generateProgressPercentage()).toBe(0);
  });

  it('deve usar valor padrão para amount quando não fornecido', () => {
    expect(generateProgressPercentage(undefined, 0)).toBe(0);
  });

  it('deve lidar com valores decimais', () => {
    expect(generateProgressPercentage(10.5, 5.25)).toBe(50);
    expect(generateProgressPercentage(7.5, 2.5)).toBe(33);
  });

  it('deve retornar 0 quando NaN é gerado', () => {
    expect(generateProgressPercentage(0, 0)).toBe(0);
  });

  it('deve lidar com valores muito pequenos', () => {
    expect(generateProgressPercentage(1000, 1)).toBe(0); // 0.1% arredonda para 0
    expect(generateProgressPercentage(1000, 5)).toBe(1); // 0.5% arredonda para 1
  });

  it('deve lidar com completed maior que amount', () => {
    // Caso de mais tarefas completadas que o total (edge case)
    expect(generateProgressPercentage(10, 15)).toBe(150);
  });

  it('deve lidar com números negativos', () => {
    // Edge case: números negativos
    expect(generateProgressPercentage(-10, -5)).toBe(50);
    expect(generateProgressPercentage(10, -5)).toBe(-50);
  });
});
