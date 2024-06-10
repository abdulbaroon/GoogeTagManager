"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { AuthContext } from '@/context/auth-context';
import Link from 'next/link';
import { Badge } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { getDatabase, onValue, ref } from 'firebase/database';
import { app } from '@/config/firebase';
import dayjs from 'dayjs';
import { useUserStore } from '@/store/user';

interface Notification{
    message:string
    current_date:string
    uId:string
}

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [anchorElNotifications, setAnchorElNotifications] = React.useState<HTMLButtonElement | null>(null);
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    const [notificationCount, setNotificationCount] = React.useState(10);
    const { currentUser, signOut } = React.useContext(AuthContext)
    const [navAvtar, setNavAvtar] = React.useState(currentUser?.photoURL || "");
    const {user}=useUserStore()
    const db = getDatabase(app)

    React.useEffect(() => {
        if (user.avatarUrl) {
            setNavAvtar(user.avatarUrl)
        }
    }, [user])


    React.useEffect(() => {
        if (currentUser) {
            const todoRef = ref(db, "/notifications");
            onValue(todoRef, (snapshot) => {
                const todos = snapshot.val();
                const notification: Notification[] = [];
                for (let id in todos) {
                    notification.push({ id, ...todos[id] });
                }
                const notifications=notification?.filter((ftr=>ftr.uId===currentUser?.uid))
                 setNotifications(notifications.reverse());
            });
        }
    }, [db, currentUser]);


    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleSignOut = async () => {
        await signOut();
        sessionStorage.removeItem("user")
        handleCloseUserMenu();
    };

    const pages = [
        { page: 'Todos', link: '/todo' },
        { page: 'Teams', link: '/teams' },

    ];

    const settings = currentUser ? [
        { page: 'Profile', link: '/profile' },
        { page: 'Logout', action: handleSignOut }
    ] : [
        { page: 'Sign In', link: '/Login' },
        { page: 'Sign Up', link: '/register' }
    ];

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOpenNotifications = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElNotifications(event?.currentTarget);
        setNotificationOpen((prev) => !prev);
    };

    const handleCloseNotifications = () => {
        setAnchorElNotifications(null);
        setNotificationOpen(false);
    };

    const loadMoreNofitications =()=>{
        setNotificationCount((prev)=>prev+8)
    }
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        ABD
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages?.map((page) => (
                                <MenuItem key={page?.page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" component={Link} href={page.link}>{page?.page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        ABD
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                <Typography textAlign="center" component={Link} href={page.link}>{page.page}</Typography>
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <IconButton sx={{ p: 0, mr: 4 }}  onClick={handleOpenNotifications} >
                            <Badge badgeContent={notifications?.length} color="error">
                                <Notifications sx={{ color: "#FFF" }} />
                            </Badge>
                        </IconButton>
                        <Menu open={notificationOpen} anchorEl={anchorElNotifications} onClose={handleCloseNotifications}>
                            <Box sx={{ mt: 2, height: "50vh", p: 1, display: "flex", flexDirection: "column", maxWidth: "300px", minWidth: "300px", overflowY: "scroll" }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "center" }}>Notifications</Typography>
                                {notifications?.slice(0,notificationCount)?.map((noti,index) => {
                                    return (
                                        <Box
                                            key={index}
                                            sx={{ display: "flex", borderBottom: "1px solid #E4E6EA", p: 2, alignItems: "center", cursor: "pointer", justifyContent: "space-between" }}>
                                            <Box sx={{ display: "flex", flexDirection: "column", minWidth: "95%" }}>
                                                <Typography>{noti?.message}</Typography>
                                                <Typography variant="caption">{dayjs(new Date(noti.current_date)).format("LLL").toString()}</Typography>
                                            </Box>
                                        </Box>
                                    )
                                })}
                                {notificationCount < notifications.length && (
                                    <Button sx={{ mt: 2 }} onClick={loadMoreNofitications}>
                                        Show More
                                    </Button>
                                )}
                            </Box>
                        </Menu>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={currentUser?.displayName as string} src={navAvtar as string} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings && settings?.map((setting) => (
                                <MenuItem key={setting.page} onClick={setting.action || handleCloseUserMenu}>
                                    <Link href={setting.link || "#"}>{setting.page}</Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
}
export default Navbar;