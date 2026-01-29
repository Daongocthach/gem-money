import { QUERY_KEYS } from '@/constants'
import { JarsQuery } from '@/database/queries'
import { useQuery } from '@tanstack/react-query'
import { useSQLiteContext } from 'expo-sqlite'

export const useJars = () => {
    const db = useSQLiteContext()

    const query = useQuery({
        queryKey: [QUERY_KEYS.JARS],
        queryFn: () => JarsQuery.getAll(db),
    })

    const jars = query.data || []
    const totalBalance = jars.reduce((acc, jar) => acc + jar.current_balance, 0)
    const totalItems = jars.length

    return {
        ...query,
        jars,
        totalItems,
        totalBalance,
    }
}