// __tests__/requests/routine/load-routine-by-user-id.test.ts
import { loadRoutineByUserId } from '@/requests/routine/load-routine-by-user-id';
import { apiMyWay } from '@/services/api';
import { IRoutine } from '@/interface/Routine';

jest.mock('@/services/api');

describe('loadRoutineByUserId', () => {
  const mockedApi = apiMyWay as jest.Mocked<typeof apiMyWay>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve carregar rotina por user_id com sucesso', async () => {
    const mockRoutine: IRoutine = {
      routine_id: '1',
      user_id: '123',
      guardian_id: '456',
      description: 'Atividades diárias',
      creation_date: new Date('2024-01-01'),
      guardian: {} as any,
      user: {} as any,
    };

    mockedApi.get.mockResolvedValueOnce({ data: mockRoutine } as any);

    const result = await loadRoutineByUserId('123');

    expect(result).toEqual(mockRoutine);
    expect(mockedApi.get).toHaveBeenCalledWith('/routine/user/123');
    expect(mockedApi.get).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro quando rotina não é encontrada', async () => {
    const mockError = new Error('Routine not found');
    mockedApi.get.mockRejectedValueOnce(mockError);

    await expect(loadRoutineByUserId('999')).rejects.toThrow();
    expect(mockedApi.get).toHaveBeenCalledWith('/routine/user/999');
  });

  it('deve lançar erro quando servidor está indisponível', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(loadRoutineByUserId('123')).rejects.toThrow('Network Error');
  });

  it('deve fazer requisição com o ID correto', async () => {
    const mockRoutine: IRoutine = {
      routine_id: '1',
      user_id: '789',
      guardian_id: '456',
      description: 'Estudos diários',
      creation_date: new Date('2024-01-01'),
      guardian: {} as any,
      user: {} as any,
    };

    mockedApi.get.mockResolvedValueOnce({ data: mockRoutine } as any);

    await loadRoutineByUserId('789');

    expect(mockedApi.get).toHaveBeenCalledWith('/routine/user/789');
  });

  it('deve retornar os campos corretos da rotina', async () => {
    const mockRoutine: IRoutine = {
      routine_id: '5',
      user_id: '123',
      guardian_id: '456',
      description: 'Atividades da manhã',
      creation_date: new Date('2024-01-15'),
      guardian: {} as any,
      user: {} as any,
    };

    mockedApi.get.mockResolvedValueOnce({ data: mockRoutine } as any);

    const result = await loadRoutineByUserId('123');

    expect(result.routine_id).toBe('5');
    expect(result.user_id).toBe('123');
    expect(result.guardian_id).toBe('456');
    expect(result.description).toBe('Atividades da manhã');
  });

  it('deve lidar com IDs de diferentes formatos', async () => {
    const mockRoutine: IRoutine = {
      routine_id: '1',
      user_id: 'uuid-123-456',
      guardian_id: '456',
      description: 'Desc',
      creation_date: new Date(),
      guardian: {} as any,
      user: {} as any,
    };

    mockedApi.get.mockResolvedValueOnce({ data: mockRoutine } as any);

    await loadRoutineByUserId('uuid-123-456');

    expect(mockedApi.get).toHaveBeenCalledWith('/routine/user/uuid-123-456');
  });
});
