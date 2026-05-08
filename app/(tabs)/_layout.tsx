import { Tabs } from 'expo-router';
import { House, List, Plus, PlusCircle, UserRound } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <House
              size={24}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name='generating'
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <PlusCircle
              size={24}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name='categories'
        options={{
          title: 'List',
          tabBarIcon: ({ color }) => (
            <List
              size={24}
              color={color}
            />
          )
        }}
      />
    </Tabs>
  );
}