import React from 'react';

import { Stack } from 'expo-router';

export default function TabLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: 'Hábitos', headerShown: false }}
            />
            <Stack.Screen
                name="newhabit"
                options={{ title: 'Novo Hábito', headerShown: true }}
            />
            <Stack.Screen
                name="[routineId]"
                options={{ title: 'Hábitos', headerShown: false }}
            />
        </Stack>
    );
}
