import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  FloatButton,
  RowComponent,
  TextComponent
} from "@/components"
import AddIncomeForm from "@/components/jars/add-income"
import AddJarForm from "@/components/jars/add-jar-form"
import { useJars } from "@/components/jars/hooks/use-jars"
import JarCard from "@/components/jars/jar-card"
import { useAppBottomSheet } from "@/contexts/bottom-sheet-provider"
import useStore from "@/store"
import { Jar } from "@/types"


export default function JarsScreen() {
  const { t } = useTranslation()
  const { userData } = useStore()
  const { openSheet, closeSheet } = useAppBottomSheet()
  const [balance, setBalance] = useState(0)

  const {
    jars,
    totalBalance,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useJars()


  const handleOpenAddJar = () => {
    openSheet(
      <AddJarForm onSuccess={() => closeSheet()} />,
      ['70%'],
      true
    )
  }

  const handleOpenAddIncome = () => {
    openSheet(
      <AddIncomeForm onSuccess={() => closeSheet()} />,
      ['70%'],
      true
    )
  }

  return (
    <Container>
      <ColumnComponent gap={20} style={{ paddingTop: 5 }}>
        <ColumnComponent gap={5}>
          <TextComponent
            text={t("good morning") + ", " + (userData?.full_name || '')}
            type="label"
            size={15}
          />
          <RowComponent gap={10}>
            <TextComponent
              text={t("total left") + ": "}
              type="display"
            />
            <TextComponent
              text={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalBalance || 0)}
              type="display"
              fontWeight='bold'
              color='success'
            />
            <ButtonComponent
              isIconOnly
              iconProps={{
                name: "CirclePlus",
                color: 'primary',
              }}
              onPress={handleOpenAddIncome}
            />
          </RowComponent>
          <TextComponent
            text={t('safe to spend today based on your limits')}
            type="caption"
          />
        </ColumnComponent>

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

        <FloatButton
          hasBottomTabBar
          onPress={handleOpenAddJar}
        />
      </ColumnComponent>
    </Container>
  )
}