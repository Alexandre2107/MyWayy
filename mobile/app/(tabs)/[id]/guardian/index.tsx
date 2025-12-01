import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import Card from "@/components/Card";
import Drawer from "@/components/Drawer";
import Header from "@/components/Header";
import { Loading } from "@/components/Loading";
import { IRoutine } from "@/interface/Routine";
import { createRoutine } from "@/requests/routine/create-routine";
import { loadRoutineByGuardianId } from "@/requests/routine/load-routine-by-guardian-id";
import { loadUserByEmail } from "@/requests/user/load-user-by-email";
import { goTo } from "@/utils/goTo";
import { useLocalSearchParams } from "expo-router";

export interface ISummary {
  id: string;
  date: string;
  completed: number;
  amount: number;
}

function HomeScreen() {
  const [summary, setSummary] = useState<ISummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams();
  const [routines, setRoutines] = useState<IRoutine[] | null>(null);
  const [userId, setUserId] = useState<string>("");

  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleSubmit = async (user: string, description: string) => {
    try {
      const userId = (await loadUserByEmail(user)).user_id;
      setUserId(userId);
      if (!description) description = " ";
      await createRoutine({ guardian_id: id[0], user_id: userId, description });
      fetchRoutines();
    } catch (error) {
      Alert.alert("Algo deu errado, tente novamente mais tarde!");
    }
  };

  const fetchRoutines = async () => {
    setLoading(true);
    try {
      const response = await loadRoutineByGuardianId(id[0]);
      setRoutines(response);
    } catch (error) {
      console.error("Erro ao carregar rotinas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 px-8 pt-16 bg-dark">
      <Header />

      <Drawer
        isVisible={isDrawerVisible}
        onClose={handleCloseDrawer}
        onSubmit={handleSubmit}
      />

      <View className="flex flex-col justify-between py-5 flex-1">
        <ScrollView className="gap-4">
          {routines ? (
            routines.map((routine, index) => (
              <Card
                title={routine.user.full_name}
                description={routine.description}
                document={routine.user.document}
                key={index}
                onPress={() => {
                  goTo(
                    `/(tabs)/${id}/guardian/${routine.user_id}?routineId=${routine.routine_id}?studentName=${routine.user.full_name}`
                  );
                }}
              />
            ))
          ) : (
            <View className="flex items-center justify-center">
              <Text className="text-white">Não há rotinas ainda...</Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={handleOpenDrawer}
          className="mb-8 bg-green-600 p-4 w-full flex items-center justify-center rounded-lg"
        >
          <Text className="text-white">+ Criar rotina</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default HomeScreen;
