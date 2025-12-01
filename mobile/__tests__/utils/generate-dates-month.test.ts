// __tests__/utils/generate-dates-month.test.ts
import dayjs from 'dayjs';
import { generateDatesForCurrentMonth } from '@/utils/generate-dates-month';

describe('generateDatesForCurrentMonth', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve gerar um array com 42 elementos (6 semanas)', () => {
    const dates = generateDatesForCurrentMonth();
    expect(dates).toHaveLength(42);
  });

  it('deve começar com null para dias que não são do mês atual', () => {
    // Define a data para 1 de janeiro de 2024 (segunda-feira)
    jest.setSystemTime(new Date('2024-01-15'));
    
    const dates = generateDatesForCurrentMonth();
    
    // Janeiro de 2024 começa numa segunda (dia 1 da semana)
    // Então deve haver 1 null no início (para domingo)
    expect(dates[0]).toBeNull();
  });

  it('deve conter todas as datas do mês atual', () => {
    jest.setSystemTime(new Date('2024-03-15'));
    
    const dates = generateDatesForCurrentMonth();
    const today = dayjs('2024-03-15');
    const daysInMonth = today.daysInMonth();
    
    // Filtra apenas as datas que não são null e são do mês de março
    const marchDates = dates.filter(date => 
      date !== null && dayjs(date).month() === 2 // março é mês 2 (0-indexed)
    );
    
    expect(marchDates.length).toBe(daysInMonth);
  });

  it('deve preencher o final com datas do próximo mês', () => {
    jest.setSystemTime(new Date('2024-02-15'));
    
    const dates = generateDatesForCurrentMonth();
    
    // O último elemento não deve ser null
    expect(dates[dates.length - 1]).not.toBeNull();
    
    // Verifica se há datas do próximo mês
    const nextMonthDates = dates.filter(date => 
      date !== null && dayjs(date).month() === 2 // março (próximo mês após fevereiro)
    );
    
    expect(nextMonthDates.length).toBeGreaterThan(0);
  });

  it('deve retornar datas válidas (instâncias de Date)', () => {
    const dates = generateDatesForCurrentMonth();
    
    dates.forEach(date => {
      if (date !== null) {
        expect(date).toBeInstanceOf(Date);
      }
    });
  });

  it('deve ter datas em ordem crescente (ignorando nulls)', () => {
    const dates = generateDatesForCurrentMonth();
    const validDates = dates.filter(date => date !== null) as Date[];
    
    for (let i = 1; i < validDates.length; i++) {
      expect(validDates[i].getTime()).toBeGreaterThan(validDates[i - 1].getTime());
    }
  });

  it('deve funcionar corretamente para diferentes meses', () => {
    // Testa para junho de 2024
    jest.setSystemTime(new Date('2024-06-15'));
    const juneDate = generateDatesForCurrentMonth();
    expect(juneDate).toHaveLength(42);

    // Testa para dezembro de 2024
    jest.setSystemTime(new Date('2024-12-15'));
    const decDates = generateDatesForCurrentMonth();
    expect(decDates).toHaveLength(42);
  });

  it('deve lidar com anos bissextos corretamente', () => {
    // Fevereiro de 2024 (ano bissexto)
    jest.setSystemTime(new Date('2024-02-15'));
    
    const dates = generateDatesForCurrentMonth();
    const febDates = dates.filter(date => 
      date !== null && dayjs(date).month() === 1 && dayjs(date).year() === 2024
    );
    
    // Fevereiro de 2024 tem 29 dias
    expect(febDates.length).toBe(29);
  });
});
