import { useSession } from "@/hooks/useSession"; // Usar o hook de sessão atualizado
import { ILoginUser } from "@/interface/User";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export default function Login() {
  const { login } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ILoginUser, string>>>({});

  const handleSubmit = async () => {
    try {
      const validatedData = userSchema.parse({
        email,
        password,
      });

      const data: ILoginUser = {
        email: validatedData.email,
        password: validatedData.password,
      };

      await login(data.email, data.password);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ILoginUser, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ILoginUser] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        Alert.alert("Erro", "Ocorreu um erro durante o login.");
      }
    }
  };


  return (

    <View className="flex-1 bg-black justify-center px-8">
      <Text className="text-white text-4xl font-bold mb-8 text-center">myway</Text>
      <Image
        source={require('../../assets/images/days.png')}
        className="mb-8"
        style={{ width: 300, resizeMode: 'contain', alignSelf: 'center' }}
      />
      <View className="gap-2">
        <Text className="text-white">E-mail</Text>
        <TextInput
          placeholder="Digite seu e-mail"
          placeholderTextColor="#6B7280"
          className="bg-gray-800 text-white rounded-lg p-4 mb-1 w-full"
          onChangeText={setEmail}
          value={email}
        />
        {errors.email && <Text className="text-red-500 mb-4">{errors.email}</Text>}
      </View>
      <View className="gap-2 mb-6">
        <Text className="text-white">Senha</Text>
        <View className="flex-row items-center bg-gray-800 rounded-lg p-4 mb-1">
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#6B7280"
            className="text-white flex-1"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text className="text-red-500 mb-4">{errors.password}</Text>}
      </View>
      <TouchableOpacity onPress={handleSubmit} className="bg-green-600 rounded-lg p-4 w-full mb-4">
        <Text className="text-white text-center font-semibold">Entrar</Text>
      </TouchableOpacity>
      <Link href="/signup" className="text-center">
        <Text className="text-white text-center">Cadastrar-me</Text>
      </Link>
    </View>
  );
}
