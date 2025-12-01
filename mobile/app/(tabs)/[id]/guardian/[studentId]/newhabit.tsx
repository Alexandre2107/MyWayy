import { DayOfWeek, ICreateActivity, Schedule } from '@/interface/Routine';
import { createActivity } from '@/requests/activities/create-activity';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CreateHabitScreen = () => {
    const { routineId } = useLocalSearchParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [wantTime, setWantTime] = useState(false); // Novo estado para controlar o checkbox de horário
    const [schedules, setSchedules] = useState([
        { start: new Date(), end: new Date(), days: [false, true, true, true, true, true, false] }
    ]);
    const [showPicker, setShowPicker] = useState<{ index: number, type: 'start' | 'end' } | null>(null);
    const [tempDate, setTempDate] = useState<Date | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddSchedule = () => {
        setSchedules([
            ...schedules,
            { start: new Date(), end: new Date(), days: [false, false, false, false, false, false, false] }
        ]);
    };

    const handleRemoveSchedule = (index: number) => {
        const newSchedules = schedules.filter((_, i) => i !== index);
        setSchedules(newSchedules);
    };

    const toggleDay = (scheduleIndex: number, dayIndex: number) => {
        const updatedSchedules = [...schedules];
        updatedSchedules[scheduleIndex].days[dayIndex] = !updatedSchedules[scheduleIndex].days[dayIndex];
        setSchedules(updatedSchedules);
    };

    const handleTimeChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };

    const confirmTimeChange = () => {
        if (showPicker && tempDate) {
            const updatedSchedules = [...schedules];
            updatedSchedules[showPicker.index][showPicker.type] = tempDate;
            setSchedules(updatedSchedules);
            setShowPicker(null);
            setIsModalVisible(false);
        }
    };

    const handleSubmit = async () => {
        try {
            // Convertendo os dias da semana em formato esperado pela API
            const formattedSchedules: Schedule[] = schedules.map(schedule => ({
                days_of_week: schedule.days
                    .map((isSelected, index) =>
                        isSelected ? { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index] } : null
                    )
                    .filter((day): day is DayOfWeek => day !== null), // Filtra os dias válidos
                start_time: schedule.start.toISOString(), // Enviando o horário de início como string
                end_time: schedule.end.toISOString(),     // Enviando o horário de fim como string
            }));

            const activityData: ICreateActivity = {
                routine_id: parseInt(routineId[0]),
                title: title,
                description: description,
                activity_task: !wantTime, // Se não quiser colocar horário, é uma tarefa
                schedules: wantTime ? formattedSchedules : [], // Somente incluir horários se o checkbox estiver selecionado
            };

            await createActivity(activityData);
            Alert.alert('Sucesso', 'Atividade criada com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar a atividade.');
            console.error('Erro ao criar atividade:', error);
        }
    };

    const openPickerModal = (index: number, type: 'start' | 'end') => {
        setShowPicker({ index, type });
        setTempDate(schedules[index][type]);
        setIsModalVisible(true);
    };

    return (
        <ScrollView className="flex-1 bg-black p-5 py-10">
            <Text className="text-white text-3xl font-bold mb-6">Criar hábito</Text>

            <Text className="text-white mb-2">Título</Text>
            <TextInput
                placeholder="Digite o título"
                placeholderTextColor="#6B7280"
                className="bg-zinc-900 text-white rounded-lg p-4 mb-4"
                value={title}
                onChangeText={setTitle}
            />

            <Text className="text-white mb-2">Descrição</Text>
            <TextInput
                placeholder="Descreva o hábito"
                placeholderTextColor="#6B7280"
                className="bg-zinc-900 text-white rounded-lg p-4 mb-4 h-28"
                value={description}
                onChangeText={setDescription}
                multiline={true}
            />

            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-white">Quero colocar horário</Text>
                <Switch
                    value={wantTime}
                    onValueChange={setWantTime}
                    thumbColor={wantTime ? "#34D399" : "#6B7280"}
                    trackColor={{ false: "#4B5563", true: "#34D399" }}
                />
            </View>

            {wantTime && (
                <>
                    <Text className="text-white mb-4 text-xl font-bold">Horários</Text>
                    {schedules.map((schedule, scheduleIndex) => (
                        <View key={scheduleIndex} className="mb-4 bg-zinc-900 py-6 px-4 rounded-lg relative">
                            <View className="flex-row justify-between items-center mb-4">
                                <View className="flex-row items-center">
                                    <View className='flex flex-col'>
                                        <Text className='text-white mb-2'>Início</Text>
                                        <TouchableOpacity onPress={() => openPickerModal(scheduleIndex, 'start')}>
                                            <Text className="bg-zinc-900 border border-zinc-600 text-white rounded-lg p-4">
                                                {schedule.start.getHours()}:{schedule.start.getMinutes() < 10 ? `0${schedule.start.getMinutes()}` : schedule.start.getMinutes()}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View className='flex flex-col ml-4'>
                                        <Text className='text-white mb-2'>Fim</Text>
                                        <TouchableOpacity onPress={() => openPickerModal(scheduleIndex, 'end')}>
                                            <Text className="bg-zinc-900 border border-zinc-600 text-white rounded-lg p-4">
                                                {schedule.end.getHours()}:{schedule.end.getMinutes() < 10 ? `0${schedule.end.getMinutes()}` : schedule.end.getMinutes()}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <TouchableOpacity className='absolute top-[-10px] right-0' onPress={() => handleRemoveSchedule(scheduleIndex)}>
                                    <Feather name="trash-2" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row justify-between">
                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, dayIndex) => (
                                    <TouchableOpacity key={dayIndex} onPress={() => toggleDay(scheduleIndex, dayIndex)}>
                                        <View className={`h-10 w-10 rounded-lg flex items-center justify-center ${schedule.days[dayIndex] ? 'bg-green-900 border border-green-600' : 'bg-zinc-900 border border-zinc-600'}`}>
                                            <Text className="text-white">{day}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity onPress={handleAddSchedule} className="border border-zinc-500 p-4 rounded-lg mb-6 flex-row items-center justify-center">
                        <Feather name="plus" size={20} color="white" />
                        <Text className="text-white ml-2">Adicionar novo horário</Text>
                    </TouchableOpacity>
                </>
            )}

            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black bg-opacity-50">
                    <View className="bg-zinc-800 p-4 rounded-t-xl">
                        {tempDate && (
                            <DateTimePicker
                                value={tempDate}
                                mode="time"
                                is24Hour={true}
                                display="spinner"
                                onChange={handleTimeChange}
                            />
                        )}
                        <TouchableOpacity onPress={confirmTimeChange} className="bg-green-600 p-4 rounded-lg flex items-center justify-center mt-4">
                            <Text className="text-white font-semibold">Confirmar Horário</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsModalVisible(false)} className="mt-2">
                            <Text className="text-white text-center">Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity onPress={handleSubmit} className="bg-green-600 p-4 rounded-lg flex items-center justify-center mb-12">
                <Text className="text-white text-center font-semibold">Finalizar criação</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CreateHabitScreen;
