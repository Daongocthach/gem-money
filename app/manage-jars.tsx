import { useTranslation } from 'react-i18next'

import {
    ButtonComponent,
    CardContainer,
    Container,
    FlatListComponent,
    RowComponent,
    TextComponent,
} from '@/components'
import AddIncomeForm from '@/components/incomes/add-income'
import { useHomeScreen } from '@/components/jars/hooks/use-jars'
import EditJarCard from '@/components/manage-jars/edit-jar-card'
import { useAppBottomSheet } from '@/contexts/bottom-sheet-provider'
import useStore from '@/store'
import { Jar } from '@/types'
import { useRouter } from 'expo-router'

export default function ManageJarsScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { userData } = useStore()
  const { openSheet } = useAppBottomSheet()

  const {
    jars,
    totalBalance,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useHomeScreen()

  const handleOpenAddIncome = () => {
    openSheet(<AddIncomeForm />, ['80%'], true)
  }

  return (
    <Container headerTitle="manage_jars">
      <FlatListComponent
        data={jars}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <RowComponent justify="space-between" gap={20}>
            <CardContainer>
              <TextComponent text="total_allocation" />
            </CardContainer>
          </RowComponent>
        }
        renderItem={({ item }: { item: Jar }) => (
          <EditJarCard
            jar={item}
            onPercentageChange={() => {}}
            onDelete={() => {}}
          />
        )}
        onRefresh={refetch}
        refreshing={isRefetching}
        isLoading={isLoading}
        isError={isError}
        hasBottomTabBar
        extraPaddingBottom={50}
        columnWrapperStyle={{ gap: 10 }}
        ListFooterComponent={
          <ButtonComponent
            mode="outlined"
            iconProps={{
              name: 'CircleFadingArrowUp',
            }}
            textProps={{
              text: 'new jar',
            }}
            buttonStyle={{
              borderStyle: 'dashed',
            }}
          />
        }
      />
      <ButtonComponent
        textProps={{
          text: 'save',
        }}
      />
    </Container>
  )
}
