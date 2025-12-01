import React from 'react';

import { Stack } from 'expo-router';

export default function TabLayout() {

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: 'Home', headerShown: false }}
            />
            <Stack.Screen
                name="habit"
                options={{
                    title: 'Hábito',
                    headerShown: true
                }}
            />
            <Stack.Screen
                name="newhabit"
                options={{
                    title: 'Hábito',
                    headerShown: true
                }}
            />
        </Stack>
    );
}
