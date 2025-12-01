// __tests__/requests/user/load-user-by-id.test.ts
import { loadUserById } from '@/requests/user/load-user-by-id';
import { apiMyWay } from '@/services/api';
import { IUser } from '@/interface/User';

jest.mock('@/services/api');

describe('loadUserById', () => {
  const mockedApi = apiMyWay as jest.Mocked<typeof apiMyWay>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve carregar usuário por ID com sucesso', async () => {
    const mockUser: IUser = {
      user_id: '123',
      full_name: 'João Silva',
      document: '123.456.789-00',
      email: 'joao@example.com',
      password: 'hashedPassword',
      type_of_user: 'student',
      has_full_permission: true,
    };

    mockedApi.get.mockResolvedValueOnce({ data: mockUser } as any);

    const result = await loadUserById('123');

    expect(result).toEqual(mockUser);
    expect(mockedApi.get).toHaveBeenCalledWith('/user/id/123');
    expect(mockedApi.get).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro quando usuário não é encontrado', async () => {
    const mockError = new Error('User not found');
    mockedApi.get.mockRejectedValueOnce(mockError);

    await expect(loadUserById('999')).rejects.toThrow();
    expect(mockedApi.get).toHaveBeenCalledWith('/user/id/999');
  });

  it('deve lançar erro quando servidor está indisponível', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(loadUserById('123')).rejects.toThrow('Network Error');
  });
});
