import { app } from "@/config/firebase";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

const AllUsersData=()=>{
  const db = getDatabase(app);
  const newUsers:any[]= [];
 useEffect(() => { 
        const userRef = ref(db, `/users`);
        onValue(userRef, (snapshot) => {
            const users = snapshot.val();
            for (let id in users) {
              newUsers.push({ id, ...users[id] });
            }
        });
  }, [db]);
  return newUsers
}
export {AllUsersData}
