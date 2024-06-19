import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedIcon from '@mui/icons-material/Verified';


const CustomizedTimeline = (props: any) => {
    const data = props.data;
    if (data) {
        data.forEach((d: any) => {
            const desc = d?.description?.toString().split("</br>");
            d.desc = desc;
        });
    }


    return (
        <Timeline position="alternate" sx={{ fontFamily: "product" }}>
            {data?.map((d: any) => (
                <TimelineItem key={d.id}>
                    <TimelineOppositeContent
                        sx={{ m: 'auto 0', fontFamily: "product", color: "#16a084" }}
                        align="right"
                        variant="h5"
                    >
                        {props.type !== "price" ? props.type === "for" ? d?.lieu_formation : d?.lieu : d.organisateur} ({d?.annee})
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot sx={{ bgcolor: "#34495e" }}>
                            {props.type === "exp" ? <WorkIcon sx={{ fontSize: 17 }} /> : props.type === "for" ? <SchoolIcon sx={{ fontSize: 17 }} /> : <VerifiedIcon sx={{ fontSize: 17 }} />}
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span" sx={{ color: "#34495e", fontFamily: "product", fontWeight: "bold", letterSpacing: 2 }}>
                            {d?.nom}
                        </Typography>
                        {d?.desc?.map((ds: any, index: number) => (
                            <Typography key={index} sx={{ fontFamily: "product", color: "#4b5b64" }}>{ds}</Typography>
                        ))}
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
};


export default CustomizedTimeline;