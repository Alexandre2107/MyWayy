// __mocks__/@/services/api.ts
const apiMyWay = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

export { apiMyWay };
export const baseUrlSelect = jest.fn(() => 'http://localhost:3000');
