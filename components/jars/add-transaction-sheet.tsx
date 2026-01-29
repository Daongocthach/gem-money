import { ButtonComponent, ColumnComponent, TextComponent } from '@/components';
import { useTheme } from '@/hooks';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';

export default function AddTransactionSheet() {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Điểm dừng của Sheet (ví dụ: 25% và 50% màn hình)
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // Hiệu ứng làm mờ nền khi mở Sheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsAt={0}
        appearsAt={1}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.modal }}
      handleIndicatorStyle={{ backgroundColor: colors.outline }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ColumnComponent gap={20}>
          <TextComponent text="Thêm chi tiêu mới" type="title1" />
          
          <TextComponent text="Chọn hũ và nhập số tiền..." color={colors.text} />
          
          <ButtonComponent 
            textProps={{
                text: 'confirm'
            }}
            backgroundColor={colors.primary}
          />
        </ColumnComponent>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    flex: 1,
  },
});