"use client"
import { FormEvent, useContext, useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, set } from "firebase/database";
import { app } from "@/config/firebase";
import { IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Close, Delete, Edit, Save } from "@mui/icons-material";
import dayjs from "dayjs";
import { toast } from "sonner";
import PushNotification from "../utils/PushNotification";
import { AuthContext } from "@/context/auth-context";
import { Users } from "@/types/users";

const Team = () => {
    const db = getDatabase(app);
    const [users, setUsers] = useState<Users[]>([]);
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        const userRef = ref(db, `/users`);
        onValue(userRef, (snapshot) => {
            const users = snapshot.val();
            const newUsers: Users[] = [];
            for (let id in users) {
                newUsers.push({ id, ...users[id] });
            }
            setUsers(newUsers);
        });
    }, [db, currentUser]);

    return (
        <div className=" m-0 md:m-10">
            <TableContainer component={Paper} >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>ID</Typography>
                            </TableCell>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>Name</Typography>
                            </TableCell>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>Email</Typography>
                            </TableCell>
                            <TableCell component={"th"}>
                                <Typography fontWeight={"bold"}>UserType</Typography>
                            </TableCell>
                            <TableCell component={"th"} sx={{ width: "20%" }}>
                                <Typography fontWeight={"bold"}>UserStatus</Typography>
                            </TableCell>
                            <TableCell component={"th"} sx={{ width: "20%" }}>
                                <Typography fontWeight={"bold"}>Actions</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.map((user, index) => (
                            <TableRow key={user.id}>
                                <UserRow user={user} index={index} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

const UserRow = ({ user, index }: { user: Users, index: number }) => {
    const [editMode, setEditMode] = useState(false);
    const [userName, setUserName] = useState(user.userName);
    const [userEmail, setUserEmail] = useState(user.userEmail);
    const [userType, setUserType] = useState(user.userType);
    const db = getDatabase(app);
    const { currentUser } = useContext(AuthContext)

    function toggleEditMode() {
        setEditMode(prev => !prev);
    }

    function handleDelete() {
        const userRef = ref(db, `/users/${user.id}`);
        remove(userRef)
            .then(() => {
                console.log("User deleted successfully");
                toast.success("User Deleted")
                PushNotification("User Deleted by " + currentUser?.displayName, currentUser?.uid)
            })
            .catch((error) => {
                toast.error("Error: " + error?.message)
                console.error("Error deleting user: ", error);
            });
    }

    function handleUpdate() {
        const userRef = ref(db, `/users/${user.id}`);
        const updatedUser = {
            ...user,
            userName: userName,
            userEmail: userEmail,
            userType: userType,
        }
        set(userRef, updatedUser)
            .then(() => {
                toggleEditMode();
                toast.success("User Updated successfully");
                PushNotification("User Updated by " + currentUser?.displayName, currentUser?.uid);
            })
            .catch((error) => {
                toast.error("Error: " + error?.message);
                console.error("Error updating user: ", error);
            });
    }

    return (
        <>
            <TableCell>{index + 1}</TableCell>
            <TableCell contentEditable={editMode} suppressContentEditableWarning  onInput={(e:FormEvent<HTMLTableCellElement>) => setUserName(e.currentTarget.innerText)}>{userName}</TableCell>
            <TableCell contentEditable={editMode} suppressContentEditableWarning onInput={(e:FormEvent<HTMLTableCellElement>) => setUserEmail(e.currentTarget.innerText)}>{userEmail}</TableCell>
            <TableCell>
                {editMode ? (
                    <Select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        defaultValue={user.userType}
                    >
                        <MenuItem value="Guest">Guest</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="SuperAdmin">Super Admin</MenuItem>
                    </Select>
                ) : (
                    user.userType
                )}
            </TableCell>
            <TableCell><div className={`border w-28 ${user.userStatus ? "bg-green-500" : "bg-red-400"} text-center rounded-lg`} >
                    <p className="text-base TEXT-">{`${user.userStatus ? "Active" : "InActive"}`} </p>
                </div></TableCell>
            <TableCell>
                {!editMode && (
                    <IconButton size="small" onClick={toggleEditMode}><Edit /></IconButton>
                )}
                {editMode && (
                    <IconButton size="small" onClick={handleUpdate}><Save /></IconButton>
                )}
                <IconButton size="small" onClick={handleDelete}><Delete /></IconButton>
                {editMode && (
                    <IconButton size="small" onClick={toggleEditMode}><Close /></IconButton>
                )}
            </TableCell>
        </>
    );
};

export default Team;
