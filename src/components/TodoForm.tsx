'use client'
import React, { useContext, useRef, useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "@/config/firebase";
import { TextField, Button } from "@mui/material";
import { AuthContext } from "@/context/auth-context";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { toast } from "sonner";
import PushNotification from "../utils/PushNotification";

const TodoForm = () => {
    const db = getDatabase(app);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const { currentUser } = useContext(AuthContext)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newdate = formData.get("newDate")
        const title = formData.get("title")
        if (!title || !newdate) {
            toast.error('Fill the all details');
        }
        else if (currentUser) {
            const todoRef = ref(db, `/todos`);
            const todo = {
                uId:currentUser.uid,
                title: title,
                done: false,
                due_date: newdate,
                current_date: dayjs(new Date()).format('MM/DD/YYYY')

            };
            push(todoRef, todo);
            event.currentTarget.reset()
            resetDatePicker();
            toast.success('Todo Created');
            PushNotification("New todo Created by "+currentUser.displayName,currentUser.uid)

        }

        else {
            toast.error('First Login');
            event.currentTarget.reset()
        }
    }
   
    const resetDatePicker = () => {
        if (datePickerRef.current) {
            const inputElement = datePickerRef.current.querySelector('input');
            if (inputElement) {
                inputElement.value = ''; 
            }
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-center mt-10 items-center gap-3">
                <TextField id="outlined-basic" label="Task Name" name="title" variant="outlined" sx={{}} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker ref={datePickerRef} label="Select Date" name="newDate" />
                </LocalizationProvider>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}>
                    Submit
                </Button>
            </div>
        </form>
    );
}

export default TodoForm