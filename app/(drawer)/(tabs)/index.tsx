import { useTranslation } from "react-i18next"
import { View } from "react-native"

import {
  ButtonComponent,
  ColumnComponent,
  Container,
  FlatListComponent,
  FloatButton,
  RowComponent,
  TextComponent
} from "@/components"
import { useJars } from "@/components/jars/hooks/useJars"
import JarCard from "@/components/jars/jar-card"
import { useAppBottomSheet } from "@/contexts/bottom-sheet-provider"
import { useTheme } from "@/hooks"
import useStore from "@/store"
import { Jar } from "@/types"

export default function JarsScreen() {
  const { t } = useTranslation()
  const { userData } = useStore()
  const { colors } = useTheme()
  const { openSheet, closeSheet } = useAppBottomSheet()
  
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
      <ColumnComponent gap={20}>
        <TextComponent 
          text='add new expense' 
          type="title1" 
          fontWeight="bold" 
        />
        
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: colors.outline, borderRadius: 12 }}>
           <TextComponent text="Form nhập chi tiêu sẽ ở đây" color="icon" />
        </View>

        <ButtonComponent 
          textProps={{ text: t("confirm") }}
          backgroundColor={colors.primary}
          onPress={() => {
            closeSheet()
          }}
        />
      </ColumnComponent>,
      ['70%']
    )
  }

  return (
    <Container>
      <ColumnComponent gap={20} style={{ paddingTop: 5 }}>
        <ColumnComponent gap={10}>
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