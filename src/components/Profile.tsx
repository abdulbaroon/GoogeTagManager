"use client"

import { AuthContext } from '@/context/auth-context'
import { Avatar, Badge, Button, CircularProgress, Paper } from '@mui/material'
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import { getStorage, ref as sref, uploadBytes, getDownloadURL, StorageReference } from 'firebase/storage'
import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { toast } from 'sonner'
import { Users } from '@/types/users'
import { getDatabase, onValue, ref, set } from 'firebase/database'
import { app } from '@/config/firebase'
import {useUserStore } from '@/store/user'

function Profile() {
  const { currentUser } = useContext(AuthContext)
  const storage = getStorage();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const [displayName, setDisplayName] = useState<string>();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [user, setUser] = useState<Users>()
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const db = getDatabase(app);
  const storeUser=useUserStore((state)=>state.storeUsers)   

  useEffect(() => {
    const userRef = ref(db, `/users`);
    onValue(userRef, (snapshot) => {
      const users = snapshot.val();
      const newUsers: Users[] = [];
      for (let id in users) {
        newUsers.push({ id, ...users[id] });
      }
      const newUser = newUsers?.find((flr) => flr.uId === currentUser?.uid)
      if (newUser) {
        setUser(newUser)
        storeUser(newUser)
        setAvatarUrl(newUser.avatarUrl||"")
        setFirstName(newUser.firstName||"")
        setLastName(newUser.lastName||"")
       setMobileNo(newUser.mobileNo||"")
        setAddress1(newUser.address1||"")
        setAddress2(newUser.address2||"")
      }

    });
  }, [db, currentUser]);



  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files?.[0]
    if (files) {
      uploadFile(files);
    }
  }

  const uploadFile = (file: File) => {
    const mountainsRef = sref(storage, `${currentUser?.uid}/${file?.name}`);
    try {
      setLoading(true)
      uploadBytes(mountainsRef, file).then((snapshot) => {
        toast.success('File uploaded successfully');
        updateAvatarUrl(mountainsRef);
        setLoading(false)
      });
    } catch (error) {

      setLoading(false)
      console.error('Error uploading file:', error);
    }
  }

  const updateAvatarUrl = (mountainsRef: StorageReference) => {
    getDownloadURL(mountainsRef).then((url) => {
      setAvatarUrl(url);
    }).catch((error) => {
      console.error('Error getting download URL:', error);
    });
  }

  const handleUpdate = async () => {
    if (currentUser) {
      try {
        await updateProfile(currentUser!, {
          displayName: firstName +" "+ lastName,
          photoURL: avatarUrl,
        });
        updateMoreInfo()


      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  }
  const updateMoreInfo = async () => {
    const updateUser = ref(db, `/users/${user?.id}`);
    const updatedUser = {
      ...user,
      firstName: firstName,
      lastName:lastName,
      avatarUrl: avatarUrl,
      mobileNo: mobileNo,
      userStatus: status,
      address2: address2,
      address1: address1

    }
    await set(updateUser, updatedUser)
      .then(() => {
        toast.success("User Updated successfully");
      })
      .catch((error) => {
        toast.error("Error: " + error?.message);
        console.error("Error updating user: ", error);
      });
  }
  const handleResend = async () => {
    if (currentUser) {
      try {
        await sendEmailVerification(currentUser)
        toast.success("Email send successfully!");

      } catch (error) {
        console.error("`Error on sending mail`", error);
      }
    }
  }

  return (
    <div className='flex flex-col items-center mt-3'>
      <div className='border p-10 flex justify-evenly'>
        <div className='flex flex-col justify-center items-center gap-3 '>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Paper sx={{ borderRadius: "100px", padding: 1, background: "#1976D2", marginBottom: 1, marginRight: 1 }} >
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={handleFile}
                />
                <label htmlFor="raised-button-file">
                  {loading ?
                    <CircularProgress sx={{ color: "white" }} /> :
                    <AddAPhotoIcon fontSize="large" sx={{ color: "white" }} />
                  }
                </label>
              </Paper>
            }
          >
            <Avatar sx={{ width: 200, height: 200 }} alt="m" src={avatarUrl || currentUser?.photoURL as string}></Avatar>
          </Badge>
          <h1 className='text-2xl font-bold'>{currentUser?.displayName}</h1>
          <h1 className='text-xl font-semibold'>{currentUser?.email}</h1>
          <div className='w-full flex   items-center'>
            <label className='text-xl font-semibold'>Email Verification:-</label>
            <div className='flex justify-between gap-8 items-center'>
              <p className={`${currentUser?.emailVerified ? "text-green-500 border-green-500" : "text-yellow-500 border-yellow-500"} border p-1 rounded-lg ms-3 `}>{`${currentUser?.emailVerified ? "Verified" : "Pending"}`}</p>
              <Button disabled={currentUser?.emailVerified} variant='contained' size='small' onClick={handleResend}>Resend</Button>
            </div>
          </div>
          <Button variant='contained' className='text-xl font-semibold mt-5' onClick={handleUpdate}>Update Profile</Button>
        </div>
        <div className=' border p-3 rounded-xl flex flex-col gap-3 mt-3 w-5/12'>
          <div className='w-full flex justify-between items-center'>
            <label>Display Name:-</label>
            <input
              className="border rounded-md p-2 ms-3 w-1/2"
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="border  rounded-md p-2 ms-3 w-1/2"
              placeholder='LastName'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className='w-full flex justify-between items-center'>
            <label>Email:-</label>
            <input
              disabled
              className=" w-full border rounded-md p-2 ms-11"
              value={currentUser?.email as string}
            />
          </div>
          <div className='w-full flex justify-between items-center'>
            <label>Contact:-</label>
            <input
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              className=" w-full border rounded-md p-2 ms-5"
              
            />
          </div>
          <div className='w-full flex justify-between items-center'>
            <label>Status:-</label>
            <select
              className="border rounded-md p-2 ms-8 w-full "
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive" >InActive</option>
            </select>
          </div>

          <div className='w-full flex flex-col justify-between gap-3'>
            <label>Address 1:-</label>
            <textarea
              className="border rounded-md w-full p-2 "
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </div>
          <div className='w-full flex flex-col justify-between gap-3'>
            <label>Address 2:-</label>
            <textarea
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="border rounded-md w-full p-2 "
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile

