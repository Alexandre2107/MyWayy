// __tests__/requests/user/update-user.test.ts
import { updateUserById } from '@/requests/user/update-user';
import { apiMyWay } from '@/services/api';
import { ICreateUser, IUser } from '@/interface/User';

jest.mock('@/services/api');

describe('updateUserById', () => {
  const mockedApi = apiMyWay as jest.Mocked<typeof apiMyWay>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUpdateData: ICreateUser = {
    full_name: 'João Silva Updated',
    document: '123.456.789-00',
    email: 'joao.updated@example.com',
    password: 'newPassword123',
    type_of_user: 'student',
    has_full_permission: true,
  };

  it('deve atualizar usuário com sucesso', async () => {
    const mockUpdatedUser: IUser = {
      ...mockUpdateData,
      user_id: '123',
    };

    mockedApi.put.mockResolvedValueOnce({ data: mockUpdatedUser } as any);

    const result = await updateUserById('123', mockUpdateData);

    expect(result).toEqual(mockUpdatedUser);
    expect(mockedApi.put).toHaveBeenCalledWith('/user/123', mockUpdateData);
    expect(mockedApi.put).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro quando usuário não é encontrado', async () => {
    const mockError = new Error('User not found');
    mockedApi.put.mockRejectedValueOnce(mockError);

    await expect(updateUserById('999', mockUpdateData)).rejects.toThrow();
  });

  it('deve lançar erro quando dados são inválidos', async () => {
    const mockError = new Error('Validation Error');
    mockedApi.put.mockRejectedValueOnce(mockError);

    await expect(updateUserById('123', mockUpdateData)).rejects.toThrow();
  });

  it('deve atualizar apenas campos modificados', async () => {
    const partialUpdate: ICreateUser = {
      full_name: 'Novo Nome',
      document: '123.456.789-00',
      email: 'joao@example.com',
      password: 'password',
      type_of_user: 'student',
      has_full_permission: true,
    };

    const mockUpdatedUser: IUser = {
      ...partialUpdate,
      user_id: '123',
    };

    mockedApi.put.mockResolvedValueOnce({ data: mockUpdatedUser } as any);

    const result = await updateUserById('123', partialUpdate);

    expect(result.full_name).toBe('Novo Nome');
    expect(mockedApi.put).toHaveBeenCalledWith('/user/123', partialUpdate);
  });
});
