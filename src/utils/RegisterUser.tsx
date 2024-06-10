import { app } from "@/config/firebase";
import { UserCredential } from "firebase/auth";
import { getDatabase, push, ref } from "firebase/database";

const RegisterUser = (user: UserCredential, userName?: string) => {
    let firstName: string = ""
    let lastName: string = ""
    const userData = user.user
    const db = getDatabase(app);
    const notificationRef = ref(db, "/users");
    if (userName) {
        [firstName, lastName] = userName.split(' ');
    } else if (userData.displayName) {
        [firstName, lastName] = userData?.displayName?.split(' ');
    }
    const notification = {
        firstName: firstName,
        lastName:lastName,
        uId: userData.uid,
        userType: "Guest",
        userEmail: userData.email,
        userStatus: true
    }
    push(notificationRef, notification)
}

export default RegisterUser