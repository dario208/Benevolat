import { Stack } from '@mui/material';
import { MoonLoader } from "react-spinners";


const Loading = (props: any) => {
    return (
        <Stack sx={{ width: "100%", textAlign: "center" }} my={props.type === "page" ? 1 : 5}
            direction="column" justifyContent={"center"} alignItems={props.type === "portfolio" ? "left" : "center"}>
            <MoonLoader
                color="#16a084"
                loading={true}
                size={props.type === "page" ? 35 : 80}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </Stack>
    )
};


export default Loading;