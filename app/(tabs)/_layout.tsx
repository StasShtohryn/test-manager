import { Tabs } from 'expo-router';
import { House, UserRound } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Головна',
          tabBarIcon: ({ color }) => (
            <House
              size={24}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Профіль',
          tabBarIcon: ({ color }) => (
            <UserRound
              size={24}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  );
}