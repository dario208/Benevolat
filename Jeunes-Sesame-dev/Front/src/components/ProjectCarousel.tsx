import { Container, Stack } from "@mui/material";
import ProjectCard from "./ProjectCard";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1
    }
};


const ProjectCarousel = (props: any) => {

    const data = props.data;

    return (
        <Container maxWidth={"lg"} sx={{ marginTop: 4 }} >
            {
                data?.length > 2 ? (
                    <Carousel
                        infinite={true}
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        responsive={responsive}
                        ssr
                        containerClass="carousel-container"
                        deviceType={"desktop"}
                    >
                        {data?.map((d: any, index: any) => (
                            <ProjectCard key={index} />
                        ))}
                    </Carousel>
                )
                    :
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent={"center"} spacing={3}>
                        {data?.map((d: any, index: any) => (
                            <Stack key={index} direction="row" justifyContent={"center"}>
                                <ProjectCard data={d} />
                            </Stack>
                        ))}
                    </Stack>
            }
        </Container>
    );
};


export default ProjectCarousel;