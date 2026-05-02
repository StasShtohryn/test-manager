import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react'
import { auth } from '@/services/FireBaseConfig'
import { signOut } from 'firebase/auth'

export default function indexScreen() {
  const [value, setValue] = useState('passed');
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='font-bold text-lg'>Привіт, {auth.currentUser?.email}!</Text>
      <Text className='text-red-500 font-semibold text-md' onPress={() => { signOut(auth) }}>Вийти</Text>
      <View className="flex w-full max-w-sm flex-col gap-6">
        <Tabs value={value} onValueChange={setValue}>
          <TabsList>
            <TabsTrigger value="passed">
              <Text className='text-lg'>Passed Tests</Text>
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Text>Saved Tests</Text>
            </TabsTrigger>
          </TabsList>
    
          <TabsContent value="passed">
            <View className='border'>
              
            </View>
          </TabsContent>
    
          <TabsContent value="survey">
            
          </TabsContent>
        </Tabs>
      </View>
      
    </View>
  )
}