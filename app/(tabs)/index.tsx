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
    openSheet(
      <AddIncomeForm />,
      ['80%'],
      true
    )
  }

  return (
    <Container>
      <ColumnComponent gap={20} style={{ paddingTop: 5 }}>

        <ColumnComponent gap={10}>
          <RowComponent justify="space-between" alignItems="flex-start">
            <TextComponent
              text={t("welcome_back") + ", " + (userData?.full_name || '')}
              type="label"
              size={15}
            />
            <ButtonComponent
              mode="text"
              rightIconProps={{
                name: "ChevronRight",
                size: 18
              }}
              textProps={{
                text: "all_incomes",
              }}
              onPress={() => router.push('/incomes')}
            />
          </RowComponent>
          <RowComponent gap={10} onPress={handleOpenAddIncome}>
            <TextComponent
              text={t("incomes") + ": "}
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
            text="safe_to_spend_today_based_on_your_limits"
            type="caption"
          />
        </ColumnComponent>

        <FlatListComponent
          data={jars}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: Jar }) => <JarCard {...item} />}
          ListHeaderComponent={
            <ButtonComponent
              mode="outlined"
              iconProps={{
                name: "Settings2"
              }}
              textProps={{
                text: "manage_jars",
              }}
              buttonStyle={{ padding: 8 }}
              onPress={() => router.push('/manage-jars')}
            />
          }
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
    </Container >
  )
}