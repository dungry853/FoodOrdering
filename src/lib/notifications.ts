import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from './supabase';
import { Tables } from '@/database.types';
import { useAuth } from '@/providers/AuthProvider';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken: string,title: string, body: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas.projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

const getUserToken = async (userID:any)=>{
  const {data,error} = await supabase.from('profiles').select('*').eq('id',userID).single();
  return data;
}


export const notifyUserAboutOrderUpdate = async(order: Tables<'orders'>)=>{
    const token = await getUserToken(order.user_id);
    const title = `Your order is ${order.status}`;
    let body = '';
    if(order.status == 'Cooking')
      body = 'The food is being cooked, please wait.';
    else if (order.status == 'Delivering')
      body = 'The food is being delivered to you, please wait a moment.';
    else if (order.status == 'Delivered')
      body = 'The food has been delivered successfully.';
    sendPushNotification(token.expo_push_token,title,body);
}
const fetchAllAdmin = async()=>{
  const {data,error }= await supabase.from('profiles').select('*').eq('group','ADMIN');
  if(!data){
    console.error('Error fetching admin profiles: ',error);
    return [];
  }
  return data;
}

export const notifyAdminAboutNewOrder = async(order: Tables<'orders'>)=>{
  const admins = await fetchAllAdmin();
  admins.forEach(async admin => {
    const title = 'You have new Order!';
    const body = `The Order #${order.id} is waiting for you approval.`;
    sendPushNotification(admin.expo_push_token,title,body);
  })

}