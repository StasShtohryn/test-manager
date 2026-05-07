import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';

import {
    ActivityIndicator,
    StyleSheet, Text,
    TextInput, TouchableOpacity,
    View
} from 'react-native';

import { auth } from '@/services/FireBaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { SignForm } from '@/components/sign-form';

export default function AuthScreen() {

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View className='flex-1 justify-center items-center'>
                {/* <Text style={styles.title}>
                    {isLoginMode ? 'Вхід' : 'Реєстрація'}
                </Text>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder='Ваш E-Mail' value={email}
                        onChangeText={setEmail} autoCapitalize='none'/>
                    <TextInput style={styles.input} placeholder='Ваш пароль...' value={password}
                        onChangeText={setPassword} secureTextEntry />
                </View>
                <TouchableOpacity style={styles.baseButton} onPress={handleAuth} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff"/>
                    ): (
                        <Text style={styles.btnText}>
                            {isLoginMode ? 'Увійти' : 'Створити акаунт'}
                        </Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.switchBtn} 
                    onPress={() => setIsLoginMode(!isLoginMode)}>
                    <Text style={styles.switchText}>
                        {isLoginMode
                            ? 'Немає акаунту? Зареєструватися'
                            : 'Вже є акаунт? Увійти'}
                    </Text>
                </TouchableOpacity> */}
                <SignForm />
            </View>
        </>

    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 20 },
    title: { fontSize: 24, fontWeight: '600', fontFamily: 'monospace', marginBottom: 20, marginTop: 10, color: 'black' },
    inputContainer: { gap: 10 },
    input: {
        width: 300, height: 40, borderWidth: 1, borderColor: 'black', padding: 10, fontSize: 14, fontFamily: 'monospace'
    },
    baseButton: {
        width: 300, fontFamily: 'monospace', borderWidth: 2, borderColor: 'black', paddingVertical: 10, alignItems: 'center'
    },
    btnText: { color: 'black', fontWeight: 600, fontSize: 16, backgroundColor: 'white', },
    switchBtn: { alignItems: 'center' },
    switchText: { color: 'black', fontFamily: 'monospace', fontWeight: '400', fontSize: 13 }
})