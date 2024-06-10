"use client"
import { app } from '@/config/firebase';
import { AuthContext } from '@/context/auth-context';
import dayjs from 'dayjs';
import { getDatabase, push, ref } from 'firebase/database';
import React, { useContext } from 'react'

const PushNotification = (message:string,userId:string|undefined) => {
    const db = getDatabase(app);
        const notificationRef = ref(db,"/notifications");
        const notification= {
            uId:userId,
            message:message,
            current_date: dayjs(new Date()).toISOString()

        }
        push(notificationRef,notification)
    }

export default PushNotification