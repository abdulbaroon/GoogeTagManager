"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { GithubAuth, GoogleAuth, ResetPassword, signInUser } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ForgetPassword() {
    const navigate = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email') as string;
        try{
          const result=await ResetPassword(email)
          toast.success("Reset email Sended on your gmail"+result)
        }catch(err:any){
            toast.error(err)
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
                            Forget Password
                        </Typography>
                        
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="user"
                                label="UserName"
                                id="user"
                                autoComplete="text"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Send Forget Email
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="Login" variant="body2">
                                        Back To SignUp 
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>

                    </Box>
                </Box>
            </Container>
        </div>
    );
}
