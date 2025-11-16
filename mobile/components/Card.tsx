import React from 'react'
import {
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View
} from 'react-native'

interface CardProps extends TouchableOpacityProps {
    title: string,
    description: string,
    document: string
}

function Card({ title, description, document, ...props }: CardProps) {
    return (
        <TouchableOpacity
            {...props}
            className="flex flex-col bg-zinc-900 border-zinc-800 rounded-lg p-4 ">
            <View className='flex flex-row justify-between w-full'>
                <Text className='text-white text-xl'>{title}</Text>
                <View className='bg-green-900 border border-green-600 p-2 rounded-full'>
                    <Text className='text-white'>{document}</Text>
                </View>
            </View>
            <Text className='text-gray-400 text-sm'>{description}</Text>
        </TouchableOpacity >
    )
}

export default Card