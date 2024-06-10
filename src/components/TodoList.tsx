"use client"
import { useContext, useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove, set, } from "firebase/database";
import { Todo } from "@/types/todo";
import { app } from "@/config/firebase";
import { Button, Grid, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { ArrowDownward, ArrowUpward, Close, Delete, Edit, Save } from "@mui/icons-material";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { AuthContext } from "@/context/auth-context";
import dayjs from "dayjs";
import { toast } from "sonner";
import PushNotification from "../utils/PushNotification";
import { Users } from "@/types/users";


const TodoList = () => {
    const db = getDatabase(app);
    const [todoList, setTodoList] = useState<Todo[]>([]);
    const [sortField, setSortField] = useState<string>("current_date");
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const { currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState<Users>();
    const [filterValue, setFilterValue] = useState("");
    const [filterField, setFilterField] = useState("");

    useEffect(() => {
        const userRef = ref(db, `/users`);
        onValue(userRef, (snapshot) => {
            const users = snapshot.val();
            const newUsers: any[] = [];
            for (let id in users) {
                newUsers.push({ id, ...users[id] });
            }
            const newUser = newUsers.find((flr) => flr.uId === currentUser?.uid);
            setUsers(newUser);
        });
    }, [db, currentUser]);

    useEffect(() => {
        if (currentUser) {
            const todoRef = ref(db, `/todos`);
            onValue(todoRef, (snapshot) => {
                const todos = snapshot.val();
                const newTodoList: any[] = [];
                for (let id in todos) {
                    newTodoList.push({ id, ...todos[id] });
                }
                const newTodoLists = newTodoList?.filter((ftr) => ftr.uId === currentUser?.uid || (users?.userType === 'Admin'));

                const filteredTodoList = newTodoLists.filter(todo => {
                    if (!filterValue || !filterField) return true;
                    return todo[filterField as keyof Todo]?.toLowerCase().includes(filterValue.toLowerCase());
                });

                const sortedTodoList = filteredTodoList.sort((a, b) => {
                    const aValue = a[sortField];
                    const bValue = b[sortField];
                    if (sortOrder === "asc") {
                        return aValue.localeCompare(bValue);
                    } else {
                        return bValue.localeCompare(aValue);
                    }
                });
                setTodoList(sortedTodoList);
            });
        }
    }, [db, currentUser, users, sortField, sortOrder, filterValue, filterField]);

    // Function to toggle sorting order
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    // Function to set sorting field
    const handleSortFieldChange = (field: string) => {
        setSortField(field);
        // Toggle sorting order when changing field
        toggleSortOrder();
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterField(event.target.value);
    };

    return (
        <div className="m-0 md:m-10">
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <TextField
                        label="Search Value"
                        variant="outlined"
                        size="small"
                        value={filterValue}
                        onChange={handleFilterChange}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        select
                        label="Search Field"
                        size="small"
                        variant="outlined"
                        value={filterField}
                        onChange={handleFieldChange}
                        sx={{minWidth:"120px"}}
                    >
                        <MenuItem value="title">Title</MenuItem>
                        <MenuItem value="current_date">Created Date</MenuItem>
                        <MenuItem value="due_date">Due Date</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography fontWeight={"bold"}>ID</Typography></TableCell>
                            <TableCell onClick={() => handleSortFieldChange("title")} ><Typography fontWeight={"bold"}>Name
                                { (sortOrder != "asc" && sortField === "title" ? <ArrowUpward /> : <ArrowDownward />)}</Typography></TableCell>
                            <TableCell onClick={() => handleSortFieldChange("current_date")}><Typography fontWeight={"bold"}>created Date
                            { (sortOrder != "asc" && sortField === "current_date" ? <ArrowUpward /> : <ArrowDownward />)}</Typography></TableCell>
                            <TableCell onClick={() => handleSortFieldChange("due_date")}><Typography fontWeight={"bold"}>Due Date
                            { (sortOrder != "asc" && sortField === "due_date" ? <ArrowUpward /> : <ArrowDownward />)}</Typography></TableCell>
                            <TableCell><Typography fontWeight={"bold"}>status</Typography></TableCell>
                            <TableCell><Typography fontWeight={"bold"}>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {todoList?.map((todo, index) => (
                            <TableRow key={todo.id}>
                                <TodoRow todo={todo} indexs={index} />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

const TodoRow = ({ todo, indexs }: { todo: Todo, indexs: number }) => {
    const [editMode, setEditMode] = useState(false);
    const [tittle, setTitle] = useState(todo.title);
    const [createDate, setCreateDate] = useState(todo.current_date);
    const [dueDate, setDueDate] = useState(todo.due_date);
    const db = getDatabase(app);
    const { currentUser } = useContext(AuthContext)
    function toggleEditMode() {
        setEditMode((prev) => !prev);
    }

    useEffect(() => {
        const cell = document.getElementById(todo.id);
        if (cell && editMode) {
            cell.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(cell, 1);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
        }
    }, [editMode, todo.id]);

    function handleDelete() {
        const todoRef = ref(db, `/todos/${todo.id}`);
        remove(todoRef)
            .then(() => {
                console.log("Todo deleted successfully");
                toast.success("Todo Deleted")
                PushNotification("Todo Deleted by " + currentUser?.displayName, currentUser?.uid)

            })
            .catch((error) => {
                toast.error("Error" + error?.message)
                console.error("Error deleting todo: ", error);
            });
    }

    function handleDone() {
        const todoRef = ref(db, `/todos/${todo.id}`);
        const updatedTodo = { ...todo, done: true };
        set(todoRef, updatedTodo)
            .then(() => {
                console.log("Todo updated successfully");
                toast.success("Todo marked as Done");
                PushNotification("todo Mark as Done by " + currentUser?.displayName, currentUser?.uid)

            })
            .catch((error) => {
                toast.error("Error: " + error?.message);
                console.error("Error updating todo: ", error);
            });
    }

    function handleUpdate() {
        const todoRef = ref(db, `/todos/${todo.id}`);
        const updatedTodo = {
            ...todo,
            title: tittle,
            current_date: createDate,
            due_date: dueDate,
        }
        set(todoRef, updatedTodo)
            .then(() => {
                toggleEditMode()
                toast.success("Todo Updated successfully");
                PushNotification("todo Updted by " + currentUser?.displayName, currentUser?.uid)

            })
            .catch((error) => {
                toast.error("Error: " + error?.message);
                console.error("Error updating todo: ", error);
            });
    }

    function handleTitle(event: React.FormEvent<HTMLTableCellElement>) {
        setTitle(event.currentTarget.innerText);
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(event.currentTarget, 1);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
    }
    function handleCurrentDate(event: React.FormEvent<HTMLTableCellElement>) {
        setCreateDate(event.currentTarget.innerText);
    }
    function handleDueDate(event: React.FormEvent<HTMLTableCellElement>) {
        setDueDate(event.currentTarget.innerText);
    }
    return (
        <>
            <TableCell suppressContentEditableWarning>
                {indexs + 1}
            </TableCell>
            <TableCell contentEditable={editMode} suppressContentEditableWarning id={todo.id} onInput={handleTitle}>
                {tittle}
            </TableCell>
            <TableCell contentEditable={false} suppressContentEditableWarning onInput={handleCurrentDate}>
                {dayjs(createDate).format('DD/MM/YYYY')}
            </TableCell>
            <TableCell contentEditable={false} suppressContentEditableWarning onInput={handleDueDate}>
                {dayjs(dueDate).format('DD/MM/YYYY')}
            </TableCell>
            <TableCell suppressContentEditableWarning>
                <div className={`border w-28 ${todo.done ? "bg-green-500" : "bg-red-400"} text-center rounded-lg`} >
                    <p className="text-base TEXT-">{`${todo.done ? "Completed" : "Incomplete"}`} </p>
                </div>
            </TableCell>
            <TableCell>
                {!editMode && (
                    <IconButton size="small" onClick={handleDone} >
                        <DoneOutlineIcon />
                    </IconButton>
                )}
                {!editMode && <IconButton size="small" onClick={toggleEditMode}>
                    {<Edit />}
                </IconButton>}
                {editMode && (
                    <IconButton size="small" sx={{ mr: 2 }} onClick={handleUpdate}>
                        <Save />
                    </IconButton>
                )}
                {!editMode && (
                    <IconButton size="small" sx={{ mr: 2 }} onClick={handleDelete}>
                        <Delete />
                    </IconButton>
                )}
                {editMode && (
                    <IconButton size="small" onClick={toggleEditMode}>
                        <Close />
                    </IconButton>
                )}
            </TableCell>
        </>
    );
};

export default TodoList;
