// __tests__/utils/goTo.test.ts
import { router } from 'expo-router';
import { goTo } from '@/utils/goTo';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('goTo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar router.push com o caminho fornecido', () => {
    const path = '/home';
    goTo(path);
    
    expect(router.push).toHaveBeenCalledWith(path);
    expect(router.push).toHaveBeenCalledTimes(1);
  });

  it('deve funcionar com diferentes caminhos', () => {
    const paths = ['/login', '/signup', '/settings', '/(tabs)/index'];
    
    paths.forEach(path => {
      goTo(path);
      expect(router.push).toHaveBeenCalledWith(path);
    });
    
    expect(router.push).toHaveBeenCalledTimes(paths.length);
  });

  it('deve funcionar com caminhos dinâmicos', () => {
    const dynamicPath = '/user/123';
    goTo(dynamicPath);
    
    expect(router.push).toHaveBeenCalledWith(dynamicPath);
  });

  it('deve funcionar com query parameters', () => {
    const pathWithQuery = '/search?query=test';
    goTo(pathWithQuery);
    
    expect(router.push).toHaveBeenCalledWith(pathWithQuery);
  });
});
