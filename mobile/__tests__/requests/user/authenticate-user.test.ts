// __tests__/requests/user/authenticate-user.test.ts
import { authenticateUser } from '@/requests/user/authenticate-user';
import { apiMyWay } from '@/services/api';
import { IAuthenticateUserResponse } from '@/interface/User';

jest.mock('@/services/api');

describe('authenticateUser', () => {
  const mockedApi = apiMyWay as jest.Mocked<typeof apiMyWay>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve autenticar usuário com sucesso', async () => {
    const mockResponse: IAuthenticateUserResponse = {
      user: {
        user_id: '123',
        full_name: 'João Silva',
        document: '123.456.789-00',
        email: 'joao@example.com',
        password: 'hashedPassword',
        type_of_user: 'student',
        has_full_permission: true,
      },
      token: 'mock-jwt-token',
    };

    mockedApi.post.mockResolvedValueOnce({ data: mockResponse } as any);

    const result = await authenticateUser({
      email: 'joao@example.com',
      password: 'password123',
    });

    expect(result).toEqual(mockResponse);
    expect(mockedApi.post).toHaveBeenCalledWith('/login', {
      emailOrDocument: 'joao@example.com',
      password: 'password123',
    });
    expect(mockedApi.post).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro quando credenciais estão incorretas', async () => {
    const mockError = new Error('Unauthorized');
    mockedApi.post.mockRejectedValueOnce(mockError);

    await expect(
      authenticateUser({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow();

    expect(mockedApi.post).toHaveBeenCalledWith('/login', {
      emailOrDocument: 'wrong@example.com',
      password: 'wrongpassword',
    });
  });

  it('deve lançar erro quando o servidor está indisponível', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('Network Error'));

    await expect(
      authenticateUser({
        email: 'joao@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Network Error');
  });

  it('deve enviar emailOrDocument corretamente', async () => {
    const mockResponse: IAuthenticateUserResponse = {
      user: {
        user_id: '123',
        full_name: 'João Silva',
        document: '123.456.789-00',
        email: 'joao@example.com',
        password: 'hashedPassword',
        type_of_user: 'guardian',
        has_full_permission: false,
      },
      token: 'mock-jwt-token',
    };

    mockedApi.post.mockResolvedValueOnce({ data: mockResponse } as any);

    await authenticateUser({
      email: 'joao@example.com',
      password: 'password123',
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/login', 
      expect.objectContaining({
        emailOrDocument: 'joao@example.com',
      })
    );
  });

  it('deve retornar token válido após autenticação', async () => {
    const mockResponse: IAuthenticateUserResponse = {
      user: {
        user_id: '123',
        full_name: 'Maria Santos',
        document: '987.654.321-00',
        email: 'maria@example.com',
        password: 'hashedPassword',
        type_of_user: 'student',
        has_full_permission: true,
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    };

    mockedApi.post.mockResolvedValueOnce({ data: mockResponse } as any);

    const result = await authenticateUser({
      email: 'maria@example.com',
      password: 'password123',
    });

    expect(result.token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    expect(result.user).toEqual(mockResponse.user);
  });
});
