import dayjs from 'dayjs';

export function generateDatesForCurrentMonth() {
    const today = dayjs();  // Data atual
    const firstDayOfMonth = today.startOf('month');  // Primeiro dia do mês
    const lastDayOfMonth = today.endOf('month');  // Último dia do mês

    const dates: (Date | null)[] = [];

    // Número de células vazias antes do primeiro dia (0 = domingo)
    const emptySlots = firstDayOfMonth.day(); 

    for (let i = 0; i < emptySlots; i++) {
        dates.push(null);
    }

    let currentDate = firstDayOfMonth;

    // Itera de um dia até o último dia do mês atual
    while (currentDate.isBefore(lastDayOfMonth) || currentDate.isSame(lastDayOfMonth)) {
        dates.push(currentDate.toDate());
        currentDate = currentDate.add(1, 'day'); // Adiciona um dia até chegar ao final do mês
    }

    return dates;
}
