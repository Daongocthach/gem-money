import { useTranslation } from "react-i18next"

import {
  ColumnComponent,
  Container,
  DateTimePicker,
  FlatListComponent,
  FloatButton,
  RowComponent,
  TextComponent
} from "@/components"
import AddTransactionForm from "@/components/jars/add-transaction-form"
import { useJars } from "@/components/jars/hooks/useJars"
import JarCard from "@/components/jars/jar-card"
import { useAppBottomSheet } from "@/contexts/bottom-sheet-provider"
import useStore from "@/store"
import { Jar } from "@/types"
import { useState } from "react"

export default function JarsScreen() {
  const { t } = useTranslation()
  const { userData } = useStore()
  const { openSheet, closeSheet } = useAppBottomSheet()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const {
    jars,
    totalBalance,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useJars()

  const handleOpenAddTransaction = () => {
    openSheet(
      <AddTransactionForm
        jars={jars || []}
        onSuccess={() => closeSheet()}
      />
      , ['70%'], true
    )
  }

  return (
    <Container>
      <ColumnComponent gap={20} style={{ paddingTop: 5 }}>
        <ColumnComponent gap={10}>
          <DateTimePicker
            mode="date"
            dateTime={selectedDate}
            setDateTime={setSelectedDate}
          />
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
          extraPaddingBottom={20}
          columnWrapperStyle={{ gap: 10 }}
        />

        <FloatButton
          hasBottomTabBar
          onPress={handleOpenAddTransaction}
        />
      </ColumnComponent>
    </Container>
  )
}