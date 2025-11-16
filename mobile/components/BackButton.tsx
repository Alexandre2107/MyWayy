import { useSession } from '@/hooks/useSession'
import { goTo } from '@/utils/goTo'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import colors from 'tailwindcss/colors'

function BackButton() {
    const { goBack } = useNavigation()
    const { user } = useSession()

    const goToHome = () => {
        if (user) {
            goTo(`/(tabs)/${user.user_id}/${user.type_of_user}/`)
        }
        else {
            goBack
        }
    }

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={goToHome}>
            <Feather name="arrow-left" size={32} color={colors.zinc[400]}></Feather>
        </TouchableOpacity>
    )
}

export default BackButton