import { Stack, Box } from '@mui/material';
import nodata from '../assets/images/nodata.png'


const NoData = (props: any) => {
    return (
        <Stack sx={{ width: "100%", textAlign: "center" }} direction="column" my={2} justifyContent={"center"} alignItems={"center"}>
            <Box
                component="img"
                sx={{
                    width: 300,
                    maxWidth: { xs: 300, md: 400 },
                }}
                alt="Empty data"
                src={nodata}
            />
            <h3 style={{ color: "#34495ec9", letterSpacing: 1.5 }}>{props.msg}</h3>
        </Stack>
    )
};


export default NoData;
