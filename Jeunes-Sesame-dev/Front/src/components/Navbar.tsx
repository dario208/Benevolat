import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import SchoolIcon from '@mui/icons-material/School';
import { createTheme, ThemeProvider } from '@mui/material';
import defaultAvatar from '../assets/images/student.jpg';
import { Link } from 'react-scroll';
import { ElevationScroll } from './Scrolls';


const pages = [
    { name: "A propos", link: "apropos" },
    { name: "Compétences", link: "competences" },
    { name: "Expériences", link: "experiences" },
    { name: "Formations", link: "formations" },
    { name: "Prix et distinctions", link: "distinctions" },
    { name: "Réalisations", link: "realisations" }
];


const theme = createTheme({
    components: {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontFamily: 'product'
                }
            }
        }
    }
});


const Navbar = (props: any) => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: any) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <ElevationScroll {...props}>
            <AppBar>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

                        <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />

                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'product',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            JEUNES-S
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
                                {pages.map((page) => (
                                    <Link
                                        key={page.name}
                                        onClick={handleCloseNavMenu}
                                        smooth spy
                                        to={page.link}
                                        duration={400}
                                        offset={-90}
                                    >
                                        <MenuItem >
                                            <Typography textAlign="center" sx={{ fontFamily: "product", fontSize: 15 }}>{page.name}</Typography>
                                        </MenuItem>

                                    </Link>
                                ))}
                            </Menu>
                        </Box>

                        <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'product',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            JEUNES-S
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: "center" }} >
                            {pages.map((page) => (
                                <Link
                                    key={page.name}
                                    smooth spy
                                    activeClass="nav-item"
                                    to={page.link}
                                    duration={400}
                                    offset={-90}
                                    style={{ textDecoration: "none", justifyContent: "center" }}>
                                    <Box
                                        component="h4"
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', textTransform: 'none', fontFamily: "product", fontSize: "0.91rem", pr: 5, cursor: "pointer" }}
                                    >
                                        {page.name}
                                    </Box>
                                </Link>
                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <ThemeProvider theme={theme}>
                                <IconButton sx={{ p: 0 }}>
                                    <Avatar alt="Avatar" src={props.pdp ? props.pdp : defaultAvatar} />
                                </IconButton>
                            </ThemeProvider>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ElevationScroll>
    );
};


export default Navbar;
