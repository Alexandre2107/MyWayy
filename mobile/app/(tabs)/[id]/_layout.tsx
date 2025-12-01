import React from 'react';

import { Stack } from 'expo-router';

export default function TabLayout() {

    return (
        <Stack>
            <Stack.Screen name="student" options={{ title: 'Home', headerShown: false }} />
            <Stack.Screen name="guardian" options={{ title: 'Home', headerShown: false }} />
            <Stack.Screen name="settings" options={{ title: 'Configurações', headerShown: true }} />
        </Stack>
    );
}
