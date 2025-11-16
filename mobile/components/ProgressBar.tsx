// components/ProgressBar.tsx
import { View } from "react-native";

interface ProgressBarProps {
    progress: number; // valor entre 0 e 1
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <View className="h-2 bg-gray-700 rounded-full w-full my-4">
            <View
                className="h-2 bg-green-600 rounded-full"
                style={{ width: `${progress * 100}%` }}
            />
        </View>
    );
}
