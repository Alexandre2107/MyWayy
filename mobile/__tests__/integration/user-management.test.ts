// __tests__/integration/user-management.test.ts
import { createUser } from '@/requests/user/create-user';
import { authenticateUser } from '@/requests/user/authenticate-user';
import { loadRoutineByUserId } from '@/requests/routine/load-routine-by-user-id';
import { apiMyWay } from '@/services/api';
import { ICreateUser, IUser, IAuthenticateUserResponse } from '@/interface/User';
import { IRoutine } from '@/interface/Routine';

jest.mock('@/services/api');

describe('Integration: User Management', () => {
  const mockedApi = apiMyWay as jest.Mocked<typeof apiMyWay>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar usuário e fazer login em sequência', async () => {
    // Dados para criar usuário
    const newUserData: ICreateUser = {
      full_name: 'Maria Santos',
      document: '987.654.321-00',
      email: 'maria@example.com',
      password: 'password123',
      type_of_user: 'student',
      has_full_permission: true,
    };

    // Mock para criação de usuário
    const createdUser: IUser = {
      ...newUserData,
      user_id: 'new-user-123',
    };

    mockedApi.post.mockResolvedValueOnce({ data: createdUser } as any);

    // Criar usuário
    const userResult = await createUser(newUserData);
    expect(userResult).toEqual(createdUser);
    expect(mockedApi.post).toHaveBeenCalledWith('/user', newUserData);

    // Mock para autenticação
    const authResponse: IAuthenticateUserResponse = {
      user: createdUser,
      token: 'auth-token-123',
    };

    mockedApi.post.mockResolvedValueOnce({ data: authResponse } as any);

    // Fazer login com usuário recém-criado
    const loginResult = await authenticateUser({
      email: newUserData.email,
      password: newUserData.password,
    });

    expect(loginResult).toEqual(authResponse);
    expect(loginResult.token).toBe('auth-token-123');
    expect(loginResult.user.user_id).toBe('new-user-123');
  });

  it('deve criar usuário, autenticar e carregar rotina', async () => {
    // Criar usuário
    const newUserData: ICreateUser = {
      full_name: 'Pedro Silva',
      document: '111.222.333-44',
      email: 'pedro@example.com',
      password: 'password456',
      type_of_user: 'student',
      has_full_permission: true,
    };

    const createdUser: IUser = {
      ...newUserData,
      user_id: 'user-456',
    };

    mockedApi.post.mockResolvedValueOnce({ data: createdUser } as any);

    const userResult = await createUser(newUserData);
    expect(userResult.user_id).toBe('user-456');

    // Autenticar
    const authResponse: IAuthenticateUserResponse = {
      user: createdUser,
      token: 'token-456',
    };

    mockedApi.post.mockResolvedValueOnce({ data: authResponse } as any);

    const loginResult = await authenticateUser({
      email: newUserData.email,
      password: newUserData.password,
    });

    expect(loginResult.user.user_id).toBe('user-456');

    // Carregar rotina do usuário
    const mockRoutine: IRoutine = {
      routine_id: '1',
      user_id: 'user-456',
      guardian_id: 'guardian-123',
      description: 'Rotina diária do Pedro',
      creation_date: new Date(),
      guardian: {} as any,
      user: createdUser as any,
    };

    mockedApi.get.mockResolvedValueOnce({ data: mockRoutine } as any);

    const routineResult = await loadRoutineByUserId('user-456');
    expect(routineResult.user_id).toBe('user-456');
    expect(routineResult.description).toBe('Rotina diária do Pedro');
    expect(mockedApi.get).toHaveBeenCalledWith('/routine/user/user-456');
  });

  it('deve lidar com falha na criação de usuário por email duplicado', async () => {
    const newUserData: ICreateUser = {
      full_name: 'João Existente',
      document: '123.456.789-00',
      email: 'existente@example.com',
      password: 'password123',
      type_of_user: 'guardian',
      has_full_permission: false,
    };

    // Mock de erro de email duplicado
    mockedApi.post.mockRejectedValueOnce(new Error('Email already exists'));

    await expect(createUser(newUserData)).rejects.toThrow('Email already exists');

    // Não deve tentar fazer login após falha na criação
    expect(mockedApi.post).toHaveBeenCalledTimes(1);
  });

  it('deve criar guardian e vincular com student', async () => {
    // Criar guardian
    const guardianData: ICreateUser = {
      full_name: 'Ana Guardiã',
      document: '999.888.777-66',
      email: 'ana@example.com',
      password: 'guardian123',
      type_of_user: 'guardian',
      has_full_permission: false,
    };

    const createdGuardian: IUser = {
      ...guardianData,
      user_id: 'guardian-789',
    };

    mockedApi.post.mockResolvedValueOnce({ data: createdGuardian } as any);

    const guardianResult = await createUser(guardianData);
    expect(guardianResult.type_of_user).toBe('guardian');
    expect(guardianResult.user_id).toBe('guardian-789');

    // Criar student
    const studentData: ICreateUser = {
      full_name: 'Lucas Filho',
      document: '555.444.333-22',
      email: 'lucas@example.com',
      password: 'student123',
      type_of_user: 'student',
      has_full_permission: true,
    };

    const createdStudent: IUser = {
      ...studentData,
      user_id: 'student-321',
    };

    mockedApi.post.mockResolvedValueOnce({ data: createdStudent } as any);

    const studentResult = await createUser(studentData);
    expect(studentResult.type_of_user).toBe('student');

    // Verificar que ambos foram criados
    expect(mockedApi.post).toHaveBeenCalledTimes(2);
    expect(guardianResult.user_id).toBe('guardian-789');
    expect(studentResult.user_id).toBe('student-321');
  });

  it('deve verificar permissões diferentes entre guardian e student', async () => {
    // Student com permissão completa
    const studentData: ICreateUser = {
      full_name: 'Aluno Completo',
      document: '111.111.111-11',
      email: 'aluno@example.com',
      password: 'pass123',
      type_of_user: 'student',
      has_full_permission: true,
    };

    const createdStudent: IUser = {
      ...studentData,
      user_id: 'student-full',
    };

    mockedApi.post.mockResolvedValueOnce({ data: createdStudent } as any);

    const studentResult = await createUser(studentData);
    expect(studentResult.has_full_permission).toBe(true);

    // Guardian sem permissão completa
    const guardianData: ICreateUser = {
      full_name: 'Responsável Limitado',
      document: '222.222.222-22',
      email: 'responsavel@example.com',
      password: 'pass456',
      type_of_user: 'guardian',
      has_full_permission: false,
    };

    const createdGuardian: IUser = {
      ...guardianData,
      user_id: 'guardian-limited',
    };

    mockedApi.post.mockResolvedValueOnce({ data: createdGuardian } as any);

    const guardianResult = await createUser(guardianData);
    expect(guardianResult.has_full_permission).toBe(false);
  });
});
