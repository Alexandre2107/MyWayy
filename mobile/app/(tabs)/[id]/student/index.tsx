import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import HabitDay from '@/components/HabitDay';
import Header from '@/components/Header';
import { Loading } from '@/components/Loading';
import { db } from '@/db';
import { IActivity } from '@/interface/Routine';
import { loadActivitiesByRoutine } from '@/requests/activities/load-activities-by-id';
import { loadRoutineByUserId } from '@/requests/routine/load-routine-by-user-id';
import { DAY_SIZE, WEEK_DAYS } from '@/utils/constants';
import { generateDatesForCurrentMonth } from '@/utils/generate-dates-month';
import { goTo } from '@/utils/goTo';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

const datesFromMonth = generateDatesForCurrentMonth();

function HomeScreen() {
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [completedActivities, setCompletedActivities] = useState<{ [key: string]: number }>({});

    const { id } = useLocalSearchParams();

    const fetchCompletedTasks = async () => {
        try {
            const userCompleted = db.check.find(user => user.userId === id[0]);

            if (userCompleted) {
                const newCompletedActivities: { [key: string]: number } = {};
                userCompleted.completedActivities.forEach(activity => {
                    newCompletedActivities[activity.date] = activity.ids.length;
                });
                setCompletedActivities(newCompletedActivities);
            } else {
                setCompletedActivities({});
            }
        } catch (error) {
            console.error("Error fetching completed tasks:", error);
        }
    };

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const routine = await loadRoutineByUserId(id[0]);
            const res = await loadActivitiesByRoutine(routine.routine_id);
            setActivities(res);
        } catch (error) {
            console.error("Error fetching summary:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchCompletedTasks();

            return () => { };
        }, [id])
    );

    return (
        <View className="flex-1 px-8 pt-16 bg-dark">
            <Header />

            <View className="flex-row mt-6 mb-2">
                {WEEK_DAYS.map((weekDay, index) => (
                    <Text
                        key={`${weekDay}-${index}`}
                        className="mx-1 text-xl font-bold text-center text-zinc-400"
                        style={{ width: DAY_SIZE }}>
                        {weekDay}
                    </Text>
                ))}
            </View>

            {loading ? (
                <Loading />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}>
                    <View className="flex-row flex-wrap">
                        {datesFromMonth.map((date, idx) => {
                            // Placeholder para células vazias de alinhamento
                            if (!date) {
                                return (
                                    <View
                                        key={`empty-${idx}`}
                                        className="m-1"
                                        style={{ width: DAY_SIZE, height: DAY_SIZE }}
                                    />
                                );
                            }

                            const isFuture = dayjs(date).isAfter(dayjs(), 'day');
                            const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Usar formato 'YYYY-MM-DD'
                            const taskCount = activities.filter(activity => activity.activity_task === true).length;

                            // Obtenha o número de atividades concluídas para esta data
                            const completedForDate = completedActivities[formattedDate] || 0;

                            return (
                                <HabitDay
                                    key={date.toISOString()}
                                    date={date}
                                    amount={taskCount}
                                    completed={completedForDate} // Exibe o número de tarefas concluídas
                                    disabled={isFuture}
                                    future={isFuture}
                                    onPress={() => {
                                        goTo(`/(tabs)/${id}/student/habit?date=${date.toISOString()}`);
                                    }}
                                />
                            );
                        })}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

export default HomeScreen;
