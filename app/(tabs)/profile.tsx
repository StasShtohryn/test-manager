import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { auth } from '@/services/FireBaseConfig'

export default function profileScreen() {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='font-bold text-lg'>Привіт, {auth.currentUser?.email}!</Text>
      <Text className='text-red-500 font-semibold text-md'>Вийти</Text>
    </View>
  )
}