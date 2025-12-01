import { Href, router } from "expo-router"

export const goTo = (path: string) => {
    router.push(path as Href<string>)
}