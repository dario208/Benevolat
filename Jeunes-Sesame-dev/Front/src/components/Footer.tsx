import { Container, Stack, Grid, Typography, Fab } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import SchoolIcon from '@mui/icons-material/School';


const Footer = () => {
    return (
        <Container maxWidth={false} style={{ width: "100%", backgroundColor: "#111", margin: "5% 0% 0% 0%", padding: "5% 2% 4% 2%" }}>
            <Grid container rowSpacing={4}>
                <Grid item container xs={12} md={12} justifyContent="start">
                    <Stack direction={"column"} sx={{textAlign :"center"}} justifyContent={"center"} alignItems={"center"} width={"100%"}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: { md: 'inline' },
                                fontFamily: 'product',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            <SchoolIcon sx={{ display: { md: 'inline' }, mr: 1, color: "white" }} />
                            JEUNES-S
                        </Typography>
                        <p style={{ color: "white", fontSize: 14, fontWeight: "500", lineHeight: 1.7, width: "80%", textAlign: "center" }}>
                            Promouvoir les jeunes de SESAME dans le monde professionnel.
                        </p>
                    </Stack>
                </Grid>
            </Grid>
            <Grid container sx={{ justifyContent: "center", alignItems: "center" }} mt={3}>
                <Stack px={1} className="social-icon" onClick = {() => {window.open("https://www.linkedin.com/company/iteamscommunity", '_blank')}}>
                    <Fab size="small" sx={{ backgroundColor: "#0075B5", color: "white" }} className="sc-linkedin">
                        <LinkedInIcon />
                    </Fab>
                </Stack>
                <Stack px={1} className="social-icon" onClick = {() => {window.open("https://www.facebook.com/profile.php?id=100083660835154", '_blank')}} >
                    <Fab size="small" sx={{ backgroundColor: "#1778F2", color: "white" }} className="sc-facebook">
                        <FacebookIcon />
                    </Fab>
                </Stack>
                <Stack px={1} className="social-icon" onClick = {() => {window.open("https://github.com/iTeam-S", '_blank')}}>
                    <Fab size="small" sx={{ backgroundColor: "#444", color: "white" }} className="sc-github">
                        <GitHubIcon />
                    </Fab>
                </Stack>
            </Grid>
            <p style={{ textAlign: "center", color: "white", fontSize: 14, marginTop: 10, cursor: "pointer" }} onClick = {() => {window.open("https://iteam-s.mg", '_blank')}}>
                iTeam-$ copyright {new Date().getFullYear()}
            </p>
        </Container>
    )
};


export default Footer;
