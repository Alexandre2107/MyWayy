import React, { useState } from 'react';
import { Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const userSchema = z.object({
    user: z
        .string()
        .min(1, "Usuário é obrigatório")
        .refine((value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isDocument = /^\d{12}$/.test(value);
            return emailRegex.test(value) || isDocument;
        }, {
            message: "Deve ser um e-mail válido ou um documento de 12 dígitos",
        }),
    description: z.string().optional(),
});

interface DrawerProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit: (user: string, description: string) => void;
}

const Drawer: React.FC<DrawerProps> = ({ isVisible, onClose, onSubmit }) => {
    const [user, setUser] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<{ user?: string }>({});

    const handleSubmit = () => {
        setErrors({});

        try {
            userSchema.parse({
                user,
                description,
            });

            onSubmit(user, description);
            onClose();
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const fieldErrors: { user?: string } = {};
                error.errors.forEach((err) => {
                    if (err.path[0] === "user") {
                        fieldErrors.user = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable style={{ flex: 1 }} onPress={onClose}>
                <View className="flex-1 justify-end">
                    <Pressable
                        className="bg-zinc-800 p-6 rounded-t-lg"
                        style={{ minHeight: '50%' }}
                        onPress={() => { }}
                    >
                        <TouchableOpacity onPress={onClose} className="flex items-center justify-center mb-4">
                            <View className="bg-zinc-500 h-1 w-12 rounded-full" />
                        </TouchableOpacity>
                        <Text className="text-white mb-2">Usuário</Text>
                        <TextInput
                            className="bg-zinc-900 text-white rounded-lg p-4 mb-2"
                            placeholder="Digite o e-mail ou documento"
                            placeholderTextColor="#6B7280"
                            value={user}
                            onChangeText={setUser}
                        />
                        {errors.user && <Text className="text-red-500 mb-4">{errors.user}</Text>}
                        <Text className="text-white mb-2">Descrição (opcional)</Text>
                        <TextInput
                            className="bg-zinc-900 text-white rounded-lg p-4 mb-8"
                            placeholder="Descreva sua rotina"
                            placeholderTextColor="#6B7280"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TouchableOpacity
                            className="bg-green-600 p-4 rounded-lg flex items-center justify-center"
                            onPress={handleSubmit}
                        >
                            <Text className="text-white font-semibold">Finalizar criação</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="mt-4 p-4 rounded-lg border border-zinc-400 flex items-center justify-center"
                            onPress={onClose}
                        >
                            <Text className="text-zinc-400">Cancelar</Text>
                        </TouchableOpacity>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    );
};

export default Drawer;
