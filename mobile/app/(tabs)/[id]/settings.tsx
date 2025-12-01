import { useSession } from "@/hooks/useSession"; // Hook de sessão
import { deleteUser } from "@/requests/user/delete-user";
import { updateUserById } from "@/requests/user/update-user";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";

// Definindo o esquema de validação com zod
const userSchema = z.object({
    fullName: z.string().min(1, "Nome completo é obrigatório."),
    email: z.string().email("E-mail inválido."),
    document: z.string().min(12, "RA do Aluno é obrigatório."),
});

export default function Settings() {
    const router = useRouter();
    const { getUser, updateUser, logout } = useSession();
    const user = getUser();
    const { id } = useLocalSearchParams()

    const [fullName, setFullName] = useState(user?.full_name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [document, setDocument] = useState(user?.document || "");
    const [errors, setErrors] = useState<Partial<Record<keyof typeof userSchema.shape, string>>>({});

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || "");
            setEmail(user.email || "");
            setDocument(user.document || "");
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            const validatedData = userSchema.parse({
                fullName,
                email,
                document,
            });

            if (user) {
                await updateUserById(user.user_id, {
                    full_name: validatedData.fullName,
                    email: validatedData.email,
                    document: validatedData.document,
                    password: user.password,
                    type_of_user: user.type_of_user,
                    has_full_permission: user.has_full_permission
                });

                updateUser({
                    full_name: validatedData.fullName,
                    email: validatedData.email,
                    document: validatedData.document,
                });
            }
            Alert.alert("Sucesso", "Dados atualizados com sucesso!");
            setErrors({});
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof typeof userSchema.shape, string>> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as keyof typeof userSchema.shape] = err.message;
                    }
                });
                setErrors(newErrors);
            } else {
                Alert.alert("Erro", "Ocorreu um erro ao atualizar os dados.");
            }
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja deletar sua conta? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Deletar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            if (user)
                                await deleteUser(id[0]);
                            Alert.alert("Conta Deletada", "Sua conta foi deletada com sucesso.");
                            logout()
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível deletar sua conta.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-black justify-center px-8">
            <Text className="text-white text-4xl font-bold mb-8 text-center">Configurações</Text>
            <View className="gap-2">
                <Text className="text-white">Nome completo</Text>
                <TextInput
                    placeholder="Digite seu nome completo"
                    placeholderTextColor="#6B7280"
                    className="bg-gray-800 text-white rounded-lg p-4 mb-1 w-full"
                    onChangeText={setFullName}
                    value={fullName}
                />
                {errors.fullName && <Text className="text-red-500 mb-4">{errors.fullName}</Text>}
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
                    placeholder="Digite o RA"
                    placeholderTextColor="#6B7280"
                    className="bg-gray-800 text-white rounded-lg p-4 mb-1 w-full"
                    onChangeText={setDocument}
                    value={document}
                />
                {errors.document && <Text className="text-red-500 mb-4">{errors.document}</Text>}
            </View>
            <TouchableOpacity
                className="mt-5 bg-green-600 rounded-lg p-4 w-full mb-4"
                onPress={handleUpdate}
            >
                <Text className="text-white text-center font-semibold">Atualizar Dados</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-red-600 rounded-lg p-4 w-full mb-4"
                onPress={handleDeleteAccount}
            >
                <Text className="text-white text-center font-semibold">Deletar Conta</Text>
            </TouchableOpacity>
        </View>
    );
}
