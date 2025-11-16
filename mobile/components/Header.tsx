import { useSession } from '@/hooks/useSession'
import { goTo } from '@/utils/goTo'
import { AntDesign, MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const Header = () => {
    const local = useLocalSearchParams()
    const { getUser, logout } = useSession()
    const user = getUser()

    return (
        <View className="flex-row items-center justify-between w-full">
            <TouchableOpacity
                onPress={() => goTo(`/(tabs)/${local.id}/settings`)}
                className='flex flex-row items-center'
            >
                <View className='flex items-center justify-center rounded-full bg-green-500 h-11 w-11 mr-2'>
                    <AntDesign name="user" size={24} color="black" />
                </View>
                <Text className='text-white'>{user ? user.full_name : 'Usuário'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => logout()}
                className='flex items-center flex-row border w-fit border-green-500 rounded px-2 h-8'
            >
                <MaterialIcons name="logout" size={24} color="lightgreen" />
                <Text className="ml-3 text-base font-semibold text-white">Sair</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Header
