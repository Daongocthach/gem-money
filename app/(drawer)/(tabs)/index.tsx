import {
  Container,
  TextComponent
} from "@/components";
import { getAllJars, Jar } from '@/database/jar';
import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';
import { ActivityIndicator, FlatList, View } from 'react-native';

export default function HomeScreen() {
  const db = useSQLiteContext();

  // Sử dụng React Query để fetch dữ liệu
  const { data: jars, isLoading } = useQuery({
    queryKey: ['jars'],
    queryFn: () => getAllJars(db),
  });

  const renderJarItem = ({ item }: { item: Jar }) => (
    <View style={{ 
      padding: 16, 
      marginVertical: 8, 
      backgroundColor: '#1E1E2D', 
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between'
    }}>
      <View>
        <TextComponent text={item.name} size={18} color="#FFF" />
        <TextComponent text={`${item.percentage}%`} color="#A0A0A0" />
      </View>
      <TextComponent 
        text={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.current_balance)} 
        color="#4CAF50" 
      />
    </View>
  );

  return (
    <Container>
      <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
        <TextComponent text="Quản lý các hũ" size={24}  />
        
        {isLoading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={jars}
            keyExtractor={(item) => item.id}
            renderItem={renderJarItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<TextComponent text="Chưa có hũ nào được tạo" />}
          />
        )}
      </View>
    </Container>
  );
}