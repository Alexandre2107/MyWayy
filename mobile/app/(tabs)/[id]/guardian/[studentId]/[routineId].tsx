import BackButton from '@/components/BackButton';
import { Loading } from '@/components/Loading';
import { IActivity } from '@/interface/Routine';
import { deleteActivity } from '@/requests/activities/delete-activity';
import { loadActivitiesByRoutine } from '@/requests/activities/load-activities-by-id';
import { goTo } from '@/utils/goTo';
import { Feather } from '@expo/vector-icons'; // Ícone de lixeira
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

function Activities() {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<IActivity[]>([]);

    const { id, studentId, routineId, studentName } = useLocalSearchParams();

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await loadActivitiesByRoutine(routineId[0]);
            setActivities(response);
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteActivity = async (activityId: number) => {
        Alert.alert(
            'Confirmação',
            'Tem certeza de que deseja excluir essa atividade?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteActivity(activityId);
                            fetchActivities();
                        } catch (error) {
                            console.error('Erro ao excluir atividade:', error);
                        }
                    },
                },
            ],
        );
    };

    useEffect(() => {
        if (routineId) {
            fetchActivities();
        }
    }, [routineId]);

    if (!routineId) {
        return <Text className="text-white">Nenhuma rotina selecionada</Text>;
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <View className="flex-1 px-8 pt-16 bg-dark">
            <BackButton />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}>
                {activities.length > 0 ? activities.map((activity, index) => (
                    <View key={index} className='p-4 mt-4 bg-zinc-900 rounded-lg flex-row justify-between items-center'>
                        <Text className="text-white">{activity.title}</Text>
                        <TouchableOpacity onPress={() => handleDeleteActivity(activity.activity_id)}>
                            <Feather name="trash-2" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                )) : (
                    <Text className="text-white">Não tem nenhuma atividade registrada. Crie uma nova!</Text>
                )}

                <View className='gap-3 mt-6 w-full'>
                    <TouchableOpacity
                        onPress={() => goTo(`/(tabs)/${id}/guardian/${studentId}/newhabit?routineId=${routineId}?studentName=${studentName}`)}
                        className=" bg-green-600 p-4 w-full flex items-center justify-center rounded-lg"
                    >
                        <Text className="text-white">Criar atividade</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

export default Activities;
