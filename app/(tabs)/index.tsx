import { useTranslation } from "react-i18next"

import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  IconComponent,
  RowComponent,
  TextComponent
} from "@/components"
import AddIncomeForm from "@/components/incomes/add-income"
import { useHomeScreen } from "@/components/jars/hooks/use-jars"
import JarCard from "@/components/jars/jar-card"
import { useAppBottomSheet } from "@/contexts/bottom-sheet-provider"
import useStore from "@/store"
import { Jar } from "@/types"
import { formatCurrency } from "@/utils"
import { useRouter } from "expo-router"


export default function JarsScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { userData } = useStore()
  const { openSheet, closeSheet } = useAppBottomSheet()

  const {
    jars,
    totalBalance,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useHomeScreen()

  const handleOpenAddIncome = () => {
    openSheet(
      <AddIncomeForm />,
      ['80%'],
      true
    )
  }

  return (
    <Container>
      <ColumnComponent gap={20} style={{ paddingTop: 5 }}>
        <RowComponent justify="space-between" alignItems="flex-start">
          <ColumnComponent gap={5}>
            <TextComponent
              text={t("good morning") + ", " + (userData?.full_name || '')}
              type="label"
              size={15}
            />
            <RowComponent gap={10} onPress={handleOpenAddIncome}>
              <TextComponent
                text={t("total left") + ": "}
                type="display"
              />
              <TextComponent
                text={formatCurrency(totalBalance)}
                type="display"
                fontWeight='bold'
                color='success'
              />
              <IconComponent
                name="CirclePlus"
                color='primary'
                size={20}
              />
            </RowComponent>
            <TextComponent
              text='safe to spend today based on your limits'
              type="caption"
            />
          </ColumnComponent>
          <ButtonComponent
            isIconOnly
            rightIconProps={{
              name: "ChevronRight",
              color: 'primary',
            }}
            textProps={{
              text: 'all incomes',
              color: 'primary',
            }}
            onPress={() => router.push('/incomes')}
          />
        </RowComponent>

        <FlatListComponent
          data={jars}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: Jar }) => <JarCard {...item} />}
          onRefresh={refetch}
          refreshing={isRefetching}
          isLoading={isLoading}
          numColumns={2}
          isError={isError}
          hasBottomTabBar
          extraPaddingBottom={50}
          columnWrapperStyle={{ gap: 10 }}
        />
      </ColumnComponent>
    </Container>
  )
}