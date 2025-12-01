import React, { useEffect, useState } from 'react';

import { useSession } from '@/hooks/useSession';
import { goTo } from '@/utils/goTo';
import { Stack } from 'expo-router';

export default function TabLayout() {
  const { user } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (user) {
        goTo(`/(tabs)/${user.user_id}/${user.type_of_user}/`);
      } else {
        goTo('/(tabs)/');
      }
    }
  }, [isMounted, user]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'MY WAY', headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: 'Cadastre-se', headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Home', headerShown: false, }} />
    </Stack>
  );
}
