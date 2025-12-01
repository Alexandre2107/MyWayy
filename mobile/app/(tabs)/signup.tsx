// app/register.tsx
import { ICreateUser } from "@/interface/User";
import { createUser } from "@/requests/user/create-user";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";

const userSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório."),
  email: z.string().email("E-mail inválido."),
  document: z.string().min(12, "RA do Aluno é obrigatório."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  userType: z.enum(["student", "guardian"], {
    errorMap: (issue, ctx) => ({ message: 'Informe o tipo de usuário' })
  }),
});

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"student" | "guardian" | null>(null);

  const [errors, setErrors] = useState<Partial<Record<keyof ICreateUser, string>>>({});

  const handleSubmit = async () => {
    try {
      const validatedData = userSchema.parse({
        fullName,
        email,
        document,
        password,
        userType,
      });

      const data: ICreateUser = {
        email: validatedData.email,
        document: validatedData.document,
        full_name: validatedData.fullName,
        has_full_permission: validatedData.userType === "student" ? false : true,
        type_of_user: validatedData.userType,
        password: validatedData.password,
      };

      const response = await createUser(data);

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      setErrors({});
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ICreateUser, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ICreateUser] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao cadastrar o usuário.");
      }
    }
  };

  return (
    <View className="flex-1 bg-black justify-center px-8">
      <Text className="text-white text-4xl font-bold mb-8 text-center">Cadastre-se</Text>
      <View className="gap-2">
        <Text className="text-white">Nome completo</Text>
        <TextInput
          placeholder="Digite seu nome completo"
          placeholderTextColor="#6B7280"
          className="bg-gray-800 text-white rounded-lg p-4 mb-1 w-full"
          onChangeText={setFullName}
          value={fullName}
        />
        {errors.full_name && <Text className="text-red-500 mb-4">{errors.full_name}</Text>}
      </View>
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
      <View className="gap-2">
        <Text className="text-white">RA do Aluno</Text>
        <TextInput
          maxLength={12}
          placeholder="Digite o RA"
          placeholderTextColor="#6B7280"
          className="bg-gray-800 text-white rounded-lg p-4 mb-1 w-full"
          onChangeText={setDocument}
          value={document}
        />
        {errors.document && <Text className="text-red-500 mb-4">{errors.document}</Text>}
      </View>
      <View className="gap-2">
        <Text className="text-white">Senha</Text>
        <TextInput
          placeholder="Digite sua senha"
          placeholderTextColor="#6B7280"
          className="bg-gray-800 text-white rounded-lg p-4 mb-1 w-full"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        {errors.password && <Text className="text-red-500 mb-4">{errors.password}</Text>}
      </View>
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => setUserType("student")}
      >
        <View
          className={`w-6 h-6 rounded-full border-2 border-gray-800 mr-2 ${userType === "student" ? "bg-green-600 border-green-600" : ""
            }`}
        />
        <Text className="text-white">Sou o Aluno</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => setUserType("guardian")}
      >
        <View
          className={`w-6 h-6 rounded-full border-2 border-gray-800 mr-2 ${userType === "guardian" ? "bg-green-600 border-green-600" : ""
            }`}
        />
        <Text className="text-white">Sou o Responsável</Text>
      </TouchableOpacity>
      {errors.type_of_user && <Text className="text-red-500 mb-4">{errors.type_of_user}</Text>}
      <TouchableOpacity
        className="bg-green-600 rounded-lg p-4 w-full mb-4"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">Cadastrar usuário</Text>
      </TouchableOpacity>
      <Link href="/(tabs)/" className="text-center">
        <Text className="text-white text-center">Já sou cadastrado!</Text>
      </Link>
    </View>
  );
}
