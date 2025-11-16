import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ScheduleHabitProps {
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
    disable: boolean;
}

function ScheduleHabit({ startTime, endTime, title, description, checked, onToggle, disable }: ScheduleHabitProps) {

    return (
        <View className='flex-row justify-between w-full items-center'>
            <View>
                <Text className='text-white'>{startTime}</Text>
                <Text className='text-white'>{endTime}</Text>
            </View>
            <View className='h-12 bg-gray-600 w-[1px]'></View>
            <View className='w-[80%] bg-gray-600 rounded-lg flex justify-center p-3'>
                <View className='flex flex-row justify-between items-center'>
                    <Text className='text-white text-lg font-semibold'>{title}</Text>
                    <TouchableOpacity
                        className="flex-row items-center"
                        onPress={onToggle}
                        disabled={disable}
                    >
                        <View className={`w-6 h-6 rounded-lg border-2 border-gray-800 mr-2 ${checked ? 'bg-green-600' : ''} `} />
                    </TouchableOpacity>
                </View>
                <Text className='text-white text-sm'>{description}</Text>
            </View>
        </View >
    );
}

export default ScheduleHabit;
