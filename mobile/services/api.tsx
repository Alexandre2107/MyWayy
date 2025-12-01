import AsyncStorage from "@react-native-async-storage/async-storage"; // Se estiver usando React Native
import axios from "axios";

const useLocalhost = true;

export const baseUrlSelect = () => {
  if (useLocalhost) return `http://192.168.0.138:3000`;
  return "";
};

const apiMyWay = axios.create({
  baseURL: baseUrlSelect(),
});

apiMyWay.interceptors.request.use(
  async (config) => {
    const token = await getTokenFromStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.error("Erro ao obter o token:", error);
    return null;
  }
};

export { apiMyWay };
