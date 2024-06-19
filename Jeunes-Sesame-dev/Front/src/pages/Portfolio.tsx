import { useEffect, useState, Fragment, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/scss/portfolio.scss';
import defaultAvatar from '../assets/images/student.jpg';
import BaseService from '../services';
import Navbar from '../components/Navbar';
import CustomizedTimeline from '../components/Timeline';
import { Box, Button, Fab, Grid, Paper, Stack, Typography, styled } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { Container } from '@mui/system';
import SectionTitle from '../components/SectionTitle';
import skills from '../assets/images/skills.png';
import hero from '../assets/images/hero-bg.jpg';
import useMediaQuery from '@mui/material/useMediaQuery';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Link } from 'react-scroll';
import { ScrollToTop } from '../components/Scrolls';
import Footer from '../components/Footer';
import ProjectCarousel from '../components/ProjectCarousel';
import Typed from "react-typed";
import { toast } from 'react-toastify';
import { Bounce, Fade } from 'react-awesome-reveal';
import NoData from '../components/NoData';
import Loading from '../components/Loading';
import Toastr from '../components/Toastr';


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip {...props} classes={{ popper: className }} placement="bottom" />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: '#34495e',
		color: 'rgba(0, 0, 0, 0.87)',
		// maxWidth: 230,
		fontSize: theme.typography.pxToRem(12),
		borderRadius: "50px"
	},
}));


const Portfolio = (props: any) => {

	const [infoEtudiant, setInfoEtudiant] = useState<any>();
	const [competencesEtudiant, setCompetencesEtudiant] = useState<object[]>([]);
	const [experiencesEtudiant, setExperiencesEtudiant] = useState<object[]>([]);
	const [formationsEtudiant, setFormationsEtudiant] = useState<object[]>([]);
	const [distinctionsEtudiant, setDistinctionsEtudiant] = useState<object[]>([]);
	const [realisationsEtudiant, setRealisationsEtudiant] = useState<object[]>([]);
	const [textEdutiant, seTextEdutiant] = useState<string[]>([]);
	const [loadingEtudiant, setLoadingEtudiant] = useState<boolean>(true);
	const [loadingCompetences, setLoadingCompetences] = useState<boolean>(true);
	const [formatedDesc, setFormatedDesc] = useState<string[]>([]);

	const matchesQuery = useMediaQuery('(max-width:1340px)');
	let { id } = useParams();


	const getCompetencesEtudiant = useCallback(async () => {
		await BaseService.getCompetencesEtudiant(parseInt(id as string)).then(async (result: any) => {
			if (result) {
				setCompetencesEtudiant(result);
			}
		}).catch(() => {
			toast.error("Impossible de récupérer les compétences");
		});
		setLoadingCompetences(false);
	}, [id]);

	const getInfoEtudiant = useCallback(async () => {
		var typeText: string[] = [];
		await BaseService.getOneEtudiant(parseInt(id as string)).then(async (result: any) => {
			if (result) {
				setInfoEtudiant(result);
				const statutEtudiant = result?.status_professionnel.includes("cours") || (result?.status_professionnel.includes("recherche")) ? (result?.niveau_etude && result?.niveau_etude !== "null") ? result?.niveau_etude + " en " + result?.nom_filiere : result?.nom_filiere : result?.nom_filiere
				typeText.push(statutEtudiant); typeText.push(result?.nom_domaine);
				seTextEdutiant(typeText.filter((txt: string) => ![null, undefined, ""].includes(txt)));
				formatDescription(infoEtudiant?.description);
			}
		}).catch(() => {
			toast.error("Impossible de récupérer les informations");
		});
		setLoadingEtudiant(false);
	}, [id, infoEtudiant?.description]);

	const getExperiencesEtudiant = useCallback(async () => {
		await BaseService.getExperiencesEtudiant(parseInt(id as string)).then(async (result: any) => {
			if (result) {
				setExperiencesEtudiant(result);
			}
		}).catch(() => {
			toast.error("Impossible de récupérer les expériences");
		});
	}, [id]);

	const getFormationsEtudiant = useCallback(async () => {
		await BaseService.getFormationsEtudiant(parseInt(id as string)).then(async (result: any) => {
			if (result) {
				setFormationsEtudiant(result);
			}
		}).catch(() => {
			toast.error("Impossible de récupérer les formations");
		});
	}, [id]);

	const getDistinctionsEtudiant = useCallback(async () => {
		await BaseService.getDistinctionsEtudiant(parseInt(id as string)).then(async (result: any) => {
			if (result) {
				setDistinctionsEtudiant(result);
			}
		}).catch(() => {
			toast.error("Impossible de récupérer les distinctions");
		});
	}, [id]);

	const getRealisationsEtudiant = useCallback(async () => {
		await BaseService.getRealisationsEtudiant(parseInt(id as string)).then(async (result: any) => {
			if (result) {
				setRealisationsEtudiant(result);
			}
		}).catch(() => {
			toast.error("Impossible de récupérer les réalisations");
		});
	}, [id]);

	const setPopularityEtudiant = useCallback(async () => {
		await BaseService.setPopularityEtudiant(parseInt(id as string)).then(async () => {
		}).catch(() => {
			toast.error("Impossible de mettre à jour les données");
		});
	}, [id]);

	const openLink = (type: number, url: any, prenom: string) => {
		if (url) {
			window.open(url, '_blank');
		}
		else {
			let msg: string = " n'a pas de ";
			msg = type === 0 ? msg + "lien LinkedIn" : type === 1 ? msg + "lien Facebook" : msg + "CV mis en ligne";
			toast.warning(prenom + msg);
		}
	};

	const copyToClipboard = (type: number, data: any) => {
		if (type === 0) {
			if (data) {
				navigator.clipboard.writeText(data);
				toast.info("Email copié : " + data);
			}
		}
		else {
			const copyText = data[0] ? (data[0] + (data[1] ? ", " + data[1] : "")) : null;
			if (copyText) {
				navigator.clipboard.writeText(copyText);
				toast.info("Numéro copié : " + copyText);
			}
		}
	};

	const formatDescription = (desc: string) => {
		if (desc && desc !== '') {
			const fdesc = desc.toString().split("<br/>");
			setFormatedDesc(fdesc);
		}
	};


	useEffect(() => {
		(async () => { await getInfoEtudiant() })();
		(async () => { await getCompetencesEtudiant() })();
		(async () => { await getExperiencesEtudiant() })();
		(async () => { await getFormationsEtudiant() })();
		(async () => { await getDistinctionsEtudiant() })();
		(async () => { await getRealisationsEtudiant() })();
		(async () => { await setPopularityEtudiant() })();
	},
		[
			getCompetencesEtudiant, getDistinctionsEtudiant, getExperiencesEtudiant,
			getInfoEtudiant, setPopularityEtudiant, getRealisationsEtudiant, getFormationsEtudiant
		]
	);


	return (
		<div style={{ overflowX: "hidden" }}>
			<Container id="hero" maxWidth={false}
				style={{
					height: "100vh",
					background: `url(${infoEtudiant?.pdc ? infoEtudiant?.pdc : hero}) no-repeat center center fixed #000`,
					backgroundSize: "cover"
				}}>
				<Navbar pdp={infoEtudiant?.pdp} />
				<Stack direction="column" sx={{ bgcolor: 'transparent', marginLeft: '8%' }}>
					<Container maxWidth={false} sx={{ marginTop: { xs: '26vh', md: '31vh' } }}>
						{
							(!loadingEtudiant && infoEtudiant) ?
								<>
									<Bounce direction="left" cascade triggerOnce>
										<Typography sx={{ color: "white", lineHeight: 1.2, fontSize: { xs: "2.2rem", md: "4rem" }, fontFamily: "product" }}>
											{infoEtudiant?.prenoms}
										</Typography>
										<Typography sx={{ color: "white", lineHeight: 1.2, fontSize: { xs: "2.2rem", md: "4rem" }, fontFamily: "product" }}>
											{infoEtudiant?.nom}
										</Typography>
									</Bounce>
									{
										textEdutiant.length > 0 ?
											<Typed
												style={{ color: "white", fontSize: "1.5rem", lineHeight: 3 }}
												strings={textEdutiant}
												typeSpeed={40}
												backSpeed={40}
												loop
											/> : ""
									}
								</>
								: loadingEtudiant ? <Loading type="portfolio" /> : ""
						}
					</Container>
					<Container maxWidth={false}>
						<Button className='button-download' endIcon={<DownloadIcon />} variant="contained"
							onClick={() => { openLink(2, infoEtudiant?.lien_cv, infoEtudiant?.prenoms) }}
							sx={{
								my: 2,
								color: 'white',
								textTransform: 'none',
								fontFamily: "product",
								fontSize: "16px",
								width: "250px",
								backgroundColor: "#16a084",
								borderRadius: "50px",
							}}
							disableElevation
						>
							Telécharger mon CV
						</Button>
					</Container>
				</Stack>
			</Container>

			<section id="apropos">
				<Fade direction="right">
					<Container maxWidth="lg" style={{ marginTop: "5%" }}>
						<SectionTitle text={"A propos de moi"} />
						{(!loadingEtudiant && infoEtudiant) ?
							<Grid container item spacing={2} my={5} sx={{ justifyContent: "center", alignItems: "center" }}>
								<Grid container item xs={12} md={5} pb={1.5}>
									<Container maxWidth={false} sx={{ marginTop: 0, textAlign: { xs: "center", md: "end" } }}>
										<img src={infoEtudiant?.pdp ? infoEtudiant?.pdp : defaultAvatar} alt="Student" width="200"
											className={
												`rounded-circle img-thumbnail shadow-sm ${infoEtudiant?.status_professionnel.includes("recherche") ? "searching" :
													infoEtudiant?.status_professionnel.includes("Insérés") ? "inserted" : "student"}`
											}
										/>
									</Container>
								</Grid>
								<Grid container item xs={12} md={7} py={2}>
									<Container maxWidth={false} sx={{ textAlign: { xs: "center", md: "start" } }}>
										<Typography sx={{ display: { xs: "none", md: "block" }, color: "white", fontFamily: "product", fontSize: 13, py: 0.5, px: 2, backgroundColor: "#16a084", borderRadius: 50, width: 95 }}>
											A propos de moi
										</Typography>
										<h2 style={{ color: "#34495e", marginTop: 10, marginBottom: 10 }}>{infoEtudiant?.prenoms} {infoEtudiant?.nom}</h2>
										{
											formatedDesc?.map((ds: string, index: number) => (
												<p key={index} style={{ lineHeight: 1.7, color: "#4b5b64", fontSize: 16, fontFamily: "product", fontWeight: "500" }}>
													{ds}
												</p>
											))
										}
										<Grid container sx={{ alignItems: "center" }} mt={1} justifyContent={{ xs: "center", md: "start" }}>
											<Stack pr={0.5} className="social-icon">
												<LinkedInIcon onClick={() => { openLink(0, infoEtudiant?.linkedin, infoEtudiant?.prenoms) }} sx={{ color: "#4b5b64", border: "1px solid #4b5b6455", fontSize: "1rem", padding: "5px", borderRadius: "50px" }} />
											</Stack>
											<HtmlTooltip
												title={
													<Fragment>
														<Typography style={{ fontFamily: "product", padding: "1px", color: "#fff", fontSize: "13px" }}>
															{infoEtudiant?.email || infoEtudiant?.email?.length > 0 ? infoEtudiant?.email : "Aucun"}
														</Typography>
													</Fragment>
												}>
												<Stack px={0.5} className="social-icon">
													<MailOutlineOutlinedIcon onClick={() => { copyToClipboard(0, infoEtudiant?.email) }} sx={{ color: "#4b5b64", border: "1px solid #4b5b6455", fontSize: "1rem", padding: "5px", borderRadius: "50px" }} />
												</Stack>
											</HtmlTooltip>
											<HtmlTooltip
												title={
													<Fragment>
														<Typography style={{ fontFamily: "product", padding: "1px", color: "#fff", fontSize: "13px" }}>
															{infoEtudiant?.tel1 && infoEtudiant?.tel1.length > 0 ? infoEtudiant?.tel1 : "Aucun"} {infoEtudiant?.tel2 && infoEtudiant?.tel2.length > 0 ? ", " + infoEtudiant?.tel2 : ""}
														</Typography>
													</Fragment>
												}>
												<Stack px={0.5} className="social-icon">
													<LocalPhoneRoundedIcon onClick={() => { copyToClipboard(1, [infoEtudiant?.tel1, infoEtudiant?.tel2]) }} sx={{ color: "#4b5b64", border: "1px solid #4b5b6455", fontSize: "1rem", padding: "5px", borderRadius: "50px" }} />
												</Stack>
											</HtmlTooltip>
											<Stack px={0.5} className="social-icon">
												<FacebookIcon onClick={() => { openLink(1, infoEtudiant?.facebook, infoEtudiant?.prenoms) }} sx={{ color: "#4b5b64", border: "1px solid #4b5b6455", fontSize: "1rem", padding: "5px", borderRadius: "50px" }} />
											</Stack>
										</Grid>
									</Container>
								</Grid>
							</Grid> : loadingEtudiant ? <Loading type="data" /> : ""}
					</Container>
				</Fade>
			</section>

			<section id="competences">
				<Fade direction="left">
					<Container maxWidth={false} sx={{ width: "100%", padding: { xs: "7% 5% 7% 5%", md: "2.5% 5% 2.5% 5%" }, backgroundColor: "#edf2f5" }}>
						<Grid container item spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
							<Grid container item xs={12} md={matchesQuery ? 6 : 4}>
								<Container maxWidth={false} sx={{ textAlign: { xs: "center", md: "center" } }}>
									<Box
										component="img"
										sx={{
											width: 380,
											maxWidth: { xs: 300, md: 400 },
											borderRadius: 2.2
										}}
										alt="Empty data"
										src={skills}
									/>
									<Stack direction="row" justifyContent={"center"}>
										<Typography sx={{ color: "white", fontFamily: "product", fontSize: 13, py: 0.5, px: 2, my: 2, backgroundColor: "#16a084", borderRadius: 50, width: 108 }}>
											Mes compétences
										</Typography>
									</Stack>
									<p style={{ lineHeight: 1.5, fontFamily: "product", fontSize: 15, color: "#34495e" }}>
										Les compétences professionnelles sont des aptitudes mêlant savoir-faire et savoir-être.
										Ils sont très importants.
									</p>
								</Container>
							</Grid>
							<Grid container item xs={12} md={matchesQuery ? 6 : 8}>
								{(!loadingCompetences && competencesEtudiant.length > 0) ? competencesEtudiant?.map((c: any, index) => (
									<Grid className="paper" key={index} item xs={12} sm={6} md={matchesQuery ? 6 : 4} pl={{ xs: 0, md: 2 }} py={1} px={{ xs: 2, md: 1.2 }} sx={{ justifyContent: "center", alignItems: "center", lignContents: "center" }}>
										<Paper elevation={0} sx={{ textAlign: "center", justifyContent: "center", py: 4, px: 2, backgroundColor: "white", borderRadius: 4, minHeight: 70 }}>
											<h4 style={{ color: "#34495e", fontWeight: "bold", letterSpacing: 1.5 }}>
												{c?.nom}
											</h4>
											<Grid container item justifyContent="center" mt={1}>
												<Typography sx={{ fontFamily: "product", fontSize: 15, color: "#4b5b64" }}>
													{c?.liste}
												</Typography>
											</Grid>
										</Paper>
									</Grid>
								)) : loadingCompetences ? <Loading type="data" /> : <NoData msg="Aucun compétence à afficher" />}
							</Grid>
						</Grid>
					</Container>
				</Fade>
			</section>

			{
				experiencesEtudiant.length > 0 ?
					<section id="experiences" style={{ transition: "all .2s" }}>
						<Fade direction="right">
							<Container maxWidth={false} style={{ width: "100%", margin: "5% 0% 0% 0%" }} >
								<SectionTitle text={"Expériences"} />
								<CustomizedTimeline type="exp" data={experiencesEtudiant} />
							</Container>
						</Fade>
					</section>
					: ""
			}

			{
				formationsEtudiant.length > 0 ?
					<section id="formations">
						<Fade direction="left">
							<Container maxWidth={false} style={{ width: "100%", margin: "5% 0% 0% 0%" }} >
								<SectionTitle text={"Formations et diplômes"} />
								<CustomizedTimeline type="for" data={formationsEtudiant} />
							</Container>
						</Fade>
					</section>
					: ""
			}

			{
				distinctionsEtudiant.length > 0 ?
					<section id="distinctions">
						<Fade direction="right">
							<Container maxWidth={false} style={{ width: "100%", margin: "5% 0% 0% 0%" }} >
								<SectionTitle text={"Prix et distinctions"} />
								<CustomizedTimeline type="price" data={distinctionsEtudiant} />
							</Container>
						</Fade>
					</section>
					: ""
			}

			{
				realisationsEtudiant.length > 0 ?
					<section id="realisations">
						<Fade direction="left">
							<Container maxWidth={false} style={{ width: "100%", margin: "5% 0% 0% 0%" }} >
								<SectionTitle text={"Réalisations"} />
								<ProjectCarousel data={realisationsEtudiant} />
							</Container>
						</Fade>
					</section>
					: ""
			}

			<section id="footer">
				<Footer />
			</section>

			<ScrollToTop {...props}>
				<Link
					smooth spy
					duration={400}
					style={{ textDecoration: "none" }}
					to="hero">
					<Fab sx={{ backgroundColor: "#16a085" }} size="small" aria-label="scroll back to top">
						<KeyboardArrowUpIcon sx={{ color: "#fff" }} />
					</Fab>
				</Link>
			</ScrollToTop>

			<Toastr />

		</div>
	);
}


export default Portfolio;
