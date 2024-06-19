import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import cardImg from '../assets/images/card-img.jpg';
import EastIcon from '@mui/icons-material/East';


const ProjectCard = (props: any) => {

    const realisation = props.data;

    const openLink = (url: any) => {
        window.open(url, '_blank');
	};

    return (
        <Card sx={{ maxWidth: 345 }} key={1}>
            <CardMedia
                component="img"
                height="200"
                image={realisation?.img ?? cardImg}
                alt="Project"
            />
            <CardContent sx={{ bgcolor: "whitesmoke" }}>
                <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: "product" }}>
                    {realisation?.nom}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "product", color: "#4b5b64" }}>
                    {realisation?.description}
                </Typography>
            </CardContent>
            <CardActions sx={{ bgcolor: "whitesmoke" }}>
                <Button className="button-card" 
                    onClick={() => {openLink(realisation?.lien)}} 
                    endIcon={<EastIcon />} disabled={realisation?.lien ? false : true}
                >
                    En savoir plus
                </Button>
            </CardActions>
        </Card>
    );
};


export default ProjectCard;