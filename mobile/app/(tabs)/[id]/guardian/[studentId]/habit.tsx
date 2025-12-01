import Checkbox from '@/components/Checkbox';
import ScheduleHabit from '@/components/ScheduleHabit';
import { db } from '@/db';
import { DaysOfWeek, IActivity, IScheduledActivity } from '@/interface/Routine';
import { loadActivitiesByRoutine } from '@/requests/activities/load-activities-by-id';
import { loadActivitiesSchedule } from '@/requests/activities/load-activity-by-day';
import { loadDaysOfSchedule } from '@/requests/activities/load-days';
import { loadRoutineByUserId } from '@/requests/routine/load-routine-by-user-id';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

function HabitScreen() {
    const { id, date, studentId } = useLocalSearchParams();

    const [activities, setActivities] = useState<IActivity[]>([]);
    const [scheduleActivities, setScheduleActivities] = useState<IScheduledActivity[]>([]);
    const [daysOfSchedule, setDaysOfSchedule] = useState<{ [key: number]: DaysOfWeek[] }>({});
    const [loading, setLoading] = useState(true);
    const [completedScheduleActivities, setCompletedScheduleActivities] = useState<number[]>([]);

    dayjs.locale('pt-br');
    const parsedDate = dayjs(date);
    const selectedDate = dayjs(date).format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const fetchCompletedTasks = async () => {
        let userCompleted = db.check.find((user) => user.userId === studentId[0]);
        if (!userCompleted) {
            userCompleted = {
                userId: studentId[0],
                completedActivities: []
            };
            db.check.push(userCompleted);
        }

        const dateCompleted = userCompleted.completedActivities.find(activity => activity.date === selectedDate);
        if (dateCompleted) {
            setCompletedScheduleActivities(dateCompleted.ids || []);
        } else {
            setCompletedScheduleActivities([]);
        }
    };

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const routine = await loadRoutineByUserId(studentId[0]);

            const activities = await loadActivitiesByRoutine(routine.routine_id);
            setActivities(activities);

            const activityIds = activities.map((activity) => activity.activity_id);
            const schedules = await loadActivitiesSchedule(activityIds);
            setScheduleActivities(schedules);

            const daysData: { [key: number]: DaysOfWeek[] } = {};

            for (const schedule of schedules) {
                const days = await loadDaysOfSchedule(schedule.activity_schedule_id);
                daysData[schedule.activity_schedule_id] = days;
            }
            setDaysOfSchedule(daysData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
        fetchCompletedTasks();
    }, [date]);

    const handleCheckboxChange = (scheduleActivityId: number) => {
        const updatedState = completedScheduleActivities.includes(scheduleActivityId)
            ? completedScheduleActivities.filter((id) => id !== scheduleActivityId)
            : [...completedScheduleActivities, scheduleActivityId];

        setCompletedScheduleActivities(updatedState);

        const userIndex = db.check.findIndex((user) => user.userId === studentId[0]);
        if (userIndex !== -1) {
            const dateCompleted = db.check[userIndex].completedActivities.find(activity => activity.date === selectedDate);
            if (dateCompleted) {
                dateCompleted.ids = updatedState;
            } else {
                db.check[userIndex].completedActivities.push({
                    date: selectedDate,
                    ids: updatedState
                });
            }
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    const scheduledActivities = activities.filter(activity => !activity.activity_task);
    const taskActivities = activities.filter(activity => activity.activity_task);

    return (
        <View className="flex-1 px-8 pt-16 bg-dark">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <Text className="text-base font-semibold lowercase text-zinc-400">{dayOfWeek}</Text>
                <Text className="text-3xl font-extrabold text-white">{dayAndMonth}</Text>
                <View className='gap-3 mt-3'>
                    {scheduledActivities.map((activity) => {
                        const scheduled = scheduleActivities.find(s => s.activity_id === activity.activity_id);
                        const relatedDays = daysOfSchedule[scheduled?.activity_schedule_id || 0] || [];
                        dayjs.locale('en-us');
                        const parsedDate = dayjs(date);
                        const dayOfWeek = parsedDate.format('ddd');

                        const isActivityOnSelectedDay = relatedDays.some(day => day.day === dayOfWeek);

                        if (scheduled && isActivityOnSelectedDay) {
                            return (
                                <View key={scheduled.activity_schedule_id}>
                                    <ScheduleHabit
                                        startTime={dayjs(scheduled.start_time).format('HH:mm')}
                                        endTime={dayjs(scheduled.end_time).format('HH:mm')}
                                        title={activity.title || 'Atividade sem nome'}
                                        description={activity.description}
                                        disable={true}
                                        checked={completedScheduleActivities.includes(scheduled.activity_schedule_id)}
                                        onToggle={() => handleCheckboxChange(scheduled.activity_schedule_id)}
                                    />
                                </View>
                            );
                        }
                    })}

                    <View className='border border-zinc-800 h-[1px] w-full my-5'></View>

                    {taskActivities.map((task) => (
                        <View key={task.activity_id} className="mb-4">
                            <Checkbox
                                title={task.title || 'Tarefa sem nome'}
                                checked={completedScheduleActivities.includes(task.activity_id)}
                                onPress={() => handleCheckboxChange(task.activity_id)}
                                className={`${today === selectedDate ? 'opacity-100' : 'opacity-40'}`}
                                disabled={true}
                            />
                        </View>
                    ))}

                    {taskActivities.length === 0 && (
                        <Text className="text-white">Nenhuma tarefa disponível.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default HabitScreen;
