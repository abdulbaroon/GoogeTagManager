"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { GithubAuth, GoogleAuth, signUpUser } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { toast } from 'sonner';
import { Github, Google } from '@/components/assets';
import Image from 'next/image';
import RegisterUser from '@/utils/RegisterUser';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignIn() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showcPassword, setShowcPassword] = React.useState(false);

  const navigate = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }; 
  const handleTogglecPasswordVisibility = () => {
    setShowcPassword(!showcPassword);
  }; 
  
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const name = data.get('name') as string;
    const confirmPassword = data.get('cpassword') as string;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
   
    

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error('Password must contain at least one uppercase letter, one special character, and be at least 8 characters long');
      return; 
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return; 
    }
    try {
      const userCredential = await signUpUser(email, password);

      if (userCredential) {
        updateProfile(userCredential.user, {
          displayName: name,
        });
        RegisterUser(userCredential,name)
        navigate.push('/todo');
        toast.success('Account Created');
      }
    } catch (error: any) {
      console.log('Failed to Create Account', error.message)
      toast.error('Failed to Create Account' + error.message)
    }
  };

  const handleGoogle = async () => {
    try {
      // Send the email and password to firebase
      const userCredential = await GoogleAuth();

      if (userCredential) {
        RegisterUser(userCredential)
        toast.success('SignIn Success');
        navigate.push('/todo');
      }
    } catch (error:any) {
      toast.error('SignIn failed' + error.message);
      console.log('User Sign In Failed', error.message);
    }
  }

  const handleGithub = async () => {
    try {
      // Send the email and password to firebase
      const userCredential = await GithubAuth();

      if (userCredential) {
        RegisterUser(userCredential)
        navigate.push('/todo');
        toast.success('SignIn Success');
      }
    } catch (error: any) {
      toast.error('SignIn failed' + error.message);
      console.log('User Sign In Failed', error.message);
    }
  }

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
              margin: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',

            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="cpassword"
                label="Conform Password"
                id="cpassword"
                type={showPassword ? "text" : "password"}
                autoComplete="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglecPasswordVisibility}
                        edge="end"
                      >
                        {showcPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box className='flex justify-between w-full mt-3 gap-2'>
                <Box className="w-1/2 border border-gray-500  flex gap-2 p-3 rounded-md hover:bg-transparent cursor-pointer"
                  onClick={handleGoogle} >
                  <Image src={Google} alt='he' height={30} width={30} />
                  <Typography component="h6" variant="h6">
                    Google
                  </Typography>
                </Box>
                <Box className="w-1/2 border border-gray-500  flex gap-2 p-3 rounded-md hover:bg-transparent cursor-pointer"
                  onClick={handleGithub}>
                  <Image src={Github} alt='he' height={30} width={30} />
                  <Typography component="h6" variant="h6">
                    Github
                  </Typography>
                </Box>
              </Box>
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
                </Grid>
                <Grid item>
                  <Link href="Login" variant="body2">
                    {"Already have an account? Sign In"}
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
