"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {  confirmThePasswordReset } from '@/config/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function ResetPassword() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showCpassword, setShowCpassword] = React.useState(false);
    const navigate = useRouter();
    const searchParams = useSearchParams()    
    const oobCode = searchParams.get('oobCode')
    console.log(oobCode,"sd")

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowCpassword = () => {
        setShowCpassword(!showCpassword);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get('password') as string;
        const cpassword = data.get('cpassword') as string
        if (password === cpassword) {
            try {
                if (oobCode) {
                    await confirmThePasswordReset(oobCode, password)
                    toast.success("Password Changed")
                    navigate.push("Login")
                } else {
                    toast.error('Something is wrong; try again later!')
                    console.log('missing oobCode')
                } 
            } catch (error: any) {
                if (error.code === 'auth/invalid-action-code') {
                    toast.error('Something is wrong; try again later.')
                }
                console.log(error.message)
            }
        } else {
            toast.error("Password should be same")
        }

    };



    return (
        <div className='bg-custombg bg-cover min-h-screen flex justify-center items-center'>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: "1px solid gray",
                    borderRadius: "8px",
                    backdropFilter: "blur(10px)",

                }}>
                    <Box
                        sx={{
                            margin: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',

                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Reset Password
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Enter Password"
                                id="user"
                                type={showPassword ? "text" : "password"}
                                autoComplete="password"
                                InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword}
                                          edge="end"
                                        >
                                          {showPassword ? <VisibilityOff /> : <Visibility  />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="cpassword"
                                label="Conform Password"
                                name="cpassword"
                                type={showCpassword ? "text" : "password"}
                                autoComplete="password"
                                InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowCpassword}
                                          edge="end"
                                        >
                                          {showCpassword ? <VisibilityOff /> : <Visibility  />}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Reset Password
                            </Button>
                        </Box>

                    </Box>
                </Box>
            </Container>
        </div>
    );
}
