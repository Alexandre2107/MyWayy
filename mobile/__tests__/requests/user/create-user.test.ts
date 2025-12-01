// __tests__/requests/user/create-user.test.ts
import { createUser } from '@/requests/user/create-user';
import { apiMyWay } from '@/services/api';
import { ICreateUser, IUser } from '@/interface/User';

jest.mock('@/services/api');

describe('createUser', () => {
  const mockedApi = apiMyWay as jest.Mocked<typeof apiMyWay>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockCreateUserData: ICreateUser = {
    full_name: 'João Silva',
    document: '123.456.789-00',
    email: 'joao@example.com',
    password: 'password123',
    type_of_user: 'student',
    has_full_permission: true,
  };

  it('deve criar usuário com sucesso', async () => {
    const mockResponse: IUser = {
      ...mockCreateUserData,
      user_id: '123',
    };

    mockedApi.post.mockResolvedValueOnce({ data: mockResponse } as any);

    const result = await createUser(mockCreateUserData);

    expect(result).toEqual(mockResponse);
    expect(mockedApi.post).toHaveBeenCalledWith('/user', mockCreateUserData);
    expect(mockedApi.post).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro quando email já existe', async () => {
    const mockError = new Error('Email already exists');
    mockedApi.post.mockRejectedValueOnce(mockError);

    await expect(createUser(mockCreateUserData)).rejects.toThrow('Email already exists');
    expect(mockedApi.post).toHaveBeenCalledWith('/user', mockCreateUserData);
  });

  it('deve criar usuário do tipo guardian', async () => {
    const guardianData: ICreateUser = {
      ...mockCreateUserData,
      type_of_user: 'guardian',
      has_full_permission: false,
    };

    const mockResponse: IUser = {
      ...guardianData,
      user_id: '456',
    };

    mockedApi.post.mockResolvedValueOnce({ data: mockResponse } as any);

    const result = await createUser(guardianData);

    expect(result.type_of_user).toBe('guardian');
    expect(result.has_full_permission).toBe(false);
  });

  it('deve criar usuário do tipo student', async () => {
    const studentData: ICreateUser = {
      ...mockCreateUserData,
      type_of_user: 'student',
      has_full_permission: true,
    };

    const mockResponse: IUser = {
      ...studentData,
      user_id: '789',
    };

    mockedApi.post.mockResolvedValueOnce({ data: mockResponse } as any);

    const result = await createUser(studentData);

    expect(result.type_of_user).toBe('student');
    expect(result.has_full_permission).toBe(true);
  });

  it('deve lançar erro quando servidor está indisponível', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('Network Error'));

    await expect(createUser(mockCreateUserData)).rejects.toThrow('Network Error');
  });

  it('deve enviar todos os campos obrigatórios', async () => {
    const mockResponse: IUser = {
      ...mockCreateUserData,
      user_id: '999',
    };

    mockedApi.post.mockResolvedValueOnce({ data: mockResponse } as any);

    await createUser(mockCreateUserData);

    expect(mockedApi.post).toHaveBeenCalledWith('/user', 
      expect.objectContaining({
        full_name: expect.any(String),
        document: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        type_of_user: expect.any(String),
        has_full_permission: expect.any(Boolean),
      })
    );
  });

  it('deve retornar user_id após criação', async () => {
    const mockResponse: IUser = {
      ...mockCreateUserData,
      user_id: 'new-user-id-123',
    };

    mockedApi.post.mockResolvedValueOnce({ data: mockResponse } as any);

    const result = await createUser(mockCreateUserData);

    expect(result.user_id).toBe('new-user-id-123');
  });

  it('deve lançar erro quando dados são inválidos', async () => {
    const mockError = new Error('Validation Error');
    mockedApi.post.mockRejectedValueOnce(mockError);

    await expect(createUser(mockCreateUserData)).rejects.toThrow('Validation Error');
  });
});
