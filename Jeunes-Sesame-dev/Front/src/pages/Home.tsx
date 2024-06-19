import { useEffect, useState, Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseService from '../services';
import {
	Container, Grid, Stack, Divider, Fab, Paper, Popover,
	Typography, Select, OutlinedInput, FormControl, MenuItem,
	Accordion, AccordionSummary, AccordionDetails,
	useMediaQuery, styled, SelectChangeEvent
} from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import { Fade } from 'react-awesome-reveal';

// Importation des images
import defaultAvatar from '../assets/images/student.jpg';

// Importation des icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FacebookIcon from '@mui/icons-material/Facebook';
import LocationOffIcon from '@mui/icons-material/LocationOff';

// Importation des components
import NoData from '../components/NoData';
import Loading from '../components/Loading';
import Toastr from '../components/Toastr';
import _ from 'lodash';


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


const ITEM_HEIGHT = 70;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			minWidth: 160,
			borderRadius: 10,
			// maxWidth: 300
		},
	},
};


const Home = () => {
	const [regions, setRegions] = useState<object[]>([]);
	const [promotions, setPromotions] = useState<object[]>([]);
	const [domains, setDomains] = useState<object[]>([]);
	const [status, setStatus] = useState<object[]>([]);
	const [etudiants, setEtudiants] = useState<object[]>([]);
	const [isRegionHover, setIsRegionHover] = useState<boolean>(false);
	const [regionHoverId, setRegionHoverId] = useState<any>();
	const [regionHoverName, setRegionHoverName] = useState<any>();
	const [regionHoverEff, setRegionHoverEff] = useState<any>();
	const [regionsActives, setRegionsActives] = useState<any>([]);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [promoName, setPromoName] = useState<string[]>([]);
	const [promoId, setPromoId] = useState<number[]>([]);
	const [statusName, setStatusName] = useState<string[]>([]);
	const [statusId, setStatusId] = useState<number[]>([]);
	const [filiereName, setFiliereName] = useState<string[]>([]);
	const [filiereId, setFiliereId] = useState<number[]>([]);
	const [domainId, setdomainId] = useState<number[]>([]);
	const [loadingMap, setLoadingMap] = useState<boolean>(true);
	const [loadingEtudiant, setLoadingEtudiant] = useState<boolean>(true);
	const [loadingNextPage, setLoadingNextPage] = useState<boolean>(false);
	const [totalPage, setTotalPage] = useState<number>(0);

	const navigate = useNavigate();
	const isToFilter = useRef(false);
	const pageNumberAll = useRef(1);
	const pageNumberFilter = useRef(1);

	const openPoper = Boolean(anchorEl);

	const selects = [
		{ id: "ps", label: "Promotions", icon: CalendarMonthIcon, data: promotions },
		{ id: "ds", label: "Domaines", icon: SchoolIcon, data: domains },
		{ id: "ss", label: "Statut pro", icon: WorkIcon, data: status }
	];

	// For the map svg viewBox
	const matchesQuery = useMediaQuery('(max-width:900px)');
	// For the inputs filters
	const matchesQuery2 = useMediaQuery('(max-width:1091px) and (min-width:828px)');
	const matchesQuery3 = useMediaQuery('(max-width:361px)');
	// For the students card md
	const matchesQuery4 = useMediaQuery('(max-width:1520px) and (min-width: 900px)');


	useEffect(() => {
		(async () => { await getAllRegions() })();
		(async () => { await getEtudiants(null, pageNumberAll.current) })();
		(async () => { await getFiltersInputs() })();
	}, []);

	useEffect(() => {
		const emptyFilters = _.isEmpty(regionsActives) && _.isEmpty(promoId) && _.isEmpty(filiereId) && _.isEmpty(statusId);
		isToFilter.current = emptyFilters ? false : true;

		if (isToFilter.current) {
			const filters = {
				region_id: !_.isEmpty(regionsActives) ? regionsActives : [],
				promotion_id: !_.isEmpty(promoId) ? promoId : [],
				filiere_id: !_.isEmpty(filiereId) ? filiereId : [],
				status_id: !_.isEmpty(statusId) ? statusId : []
			};
			(async () => {
				await getEtudiants(filters, pageNumberFilter.current);
			})();
		}
		else {
			(async () => {
				await getEtudiants(null, pageNumberAll.current);
			})();
			pageNumberFilter.current = 1;
		}
	}, [regionsActives, promoId, filiereId, statusId]);


	const getAllRegions = async () => {
		await BaseService.getAllRegions().then(async (result: any) => {
			if (result) {
				setRegions(result);
			}
		}).catch(() => {
			toast.error("Impossible de récupérer les données");
		});
		setLoadingMap(false);
	};

	const getEtudiants = async (filters: any, pageNumber: number, pagination: Boolean = false) => {
		await BaseService.getEtudiants(filters, pageNumber).then(async (result: any) => {
			if (result) {
				if (pagination) {
					setEtudiants((prevState) =>
						!_.isEmpty(result.items) ? [...prevState, ...result.items] : []
					);
				}
				else {
					setEtudiants(result.items);
				}
				setTotalPage(result.meta.totalPages);
			}
		}).catch(() => {
			toast.error("Impossible de récupérer la liste des étudiants");
		});
		setLoadingEtudiant(false);
	};

	const getFiltersInputs = async () => {
		await Promise.all(
			[await BaseService.getAllPromotions(), await BaseService.getAllDomainesFilieres(), await BaseService.getAllStatusPro()]
		).then((result) => {
			setPromotions(result[0]); setDomains(result[1]); setStatus(result[2]);
		}).catch(() => {
			toast.error("Une erreur s'est produite");
		});
	};

	const handleScroll = async (event: any) => {
		const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
		const emptyFilters = _.isEmpty(regionsActives) && _.isEmpty(promoId) && _.isEmpty(filiereId) && _.isEmpty(statusId);
		isToFilter.current = emptyFilters ? false : true;

		if (bottom) {
			setLoadingNextPage(true);
			if (isToFilter.current && (pageNumberFilter.current < totalPage)) {
				const filters = {
					region_id: !_.isEmpty(regionsActives) ? regionsActives : [],
					promotion_id: !_.isEmpty(promoId) ? promoId : [],
					filiere_id: !_.isEmpty(filiereId) ? filiereId : [],
					status_id: !_.isEmpty(statusId) ? statusId : []
				};
				pageNumberFilter.current += 1;
				pageNumberAll.current = 1;
				await getEtudiants(filters, pageNumberFilter.current, true);
			}
			if (!isToFilter.current && (pageNumberAll.current < totalPage)) {
				pageNumberAll.current += 1;
				pageNumberFilter.current = 1;
				await getEtudiants(null, pageNumberAll.current, true);
			}
			setLoadingNextPage(false);
		}
	};

	const handleCheckBox = (event: SelectChangeEvent<any>, selectId: string) => {
		const {
			target: { value },
		} = event;

		const data = value.length === 1 ? value[0] : value[value.length - 1];

		if (selectId === "ps") {
			if (!promoName.includes(data.nom)) {
				setPromoName((prevState: typeof promoName) =>
					[...prevState, data.nom]
				);
				setPromoId((prevState: typeof promoId) =>
					[...prevState, data.id]
				);
			}
			else {
				setPromoName((prevState: typeof promoName) =>
					prevState.filter((item: any) => item !== data.nom)
				);
				setPromoId((prevState: typeof promoId) =>
					prevState.filter((item: any) => item !== data.id)
				);
			}
		}
		if (selectId === "ss") {
			if (!statusName.includes(data.status)) {
				setStatusName((prevState: typeof statusName) =>
					[...prevState, data.status]
				);
				setStatusId((prevState: typeof statusId) =>
					[...prevState, data.id]
				);
			}
			else {
				setStatusName((prevState: typeof statusName) =>
					prevState.filter((item: any) => item !== data.status)
				);
				setStatusId((prevState: typeof statusId) =>
					prevState.filter((item: any) => item !== data.id)
				);
			}
		}
		isToFilter.current = true;
		pageNumberAll.current = 1;
		pageNumberFilter.current = 1;
	};

	const handleCheckBoxDomain = (idFiliere: number, labelFiliere: string, idDomain: number) => {
		if (!filiereName.includes(labelFiliere)) {
			setFiliereName((prevState: typeof filiereName) =>
				[...prevState, labelFiliere]
			);
			setFiliereId((prevState: typeof filiereId) =>
				[...prevState, idFiliere]
			);
			setdomainId((prevState: typeof domainId) =>
				[...prevState, idDomain]
			);
		}
		else {
			setFiliereName((prevState: typeof filiereName) =>
				prevState.filter((item: any) => item !== labelFiliere)
			);
			setFiliereId((prevState: typeof filiereId) =>
				prevState.filter((item: any) => item !== idFiliere)
			);

			delete domainId[domainId.indexOf(idDomain)];
			setdomainId(domainId.filter((item: any) => typeof item === "number"));
		}
		isToFilter.current = true;
		pageNumberAll.current = 1;
		pageNumberFilter.current = 1;
	};

	const clearFilter = () => {
		setRegionsActives([]);
		setPromoName([]); setPromoId([]);
		setFiliereName([]); setFiliereId([]);
		setStatusName([]); setStatusId([]);
		setdomainId([]);
		isToFilter.current = false;
		pageNumberAll.current = 1;
		pageNumberFilter.current = 1;
	};

	const handlePopoverOpen = (event: any, regionName: string, regionEff: any) => {
		setAnchorEl(event.currentTarget);
		setRegionHoverName(regionName);
		setRegionHoverEff(regionEff);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
		setRegionHoverName(null);
		setRegionHoverEff(null);
	};

	const hoverRegion = async (regionId: string) => {
		setRegionHoverId(regionId);
	};

	const handleActivesRegions = (regionId: string) => {
		if (!regionsActives.includes(regionId)) {
			setRegionsActives((prevState: typeof regionsActives) =>
				[...prevState, regionId]
			);
		}
		else {
			setRegionsActives((prevState: typeof regionsActives) =>
				prevState.filter((item: any) => item !== regionId)
			);
		}
		isToFilter.current = true;
		pageNumberAll.current = 1;
		pageNumberFilter.current = 1;
	};

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


	return (
		<>
			<Container maxWidth={false} sx={{ overflow: "hidden" }} style={{ padding: "0px" }}>
				<Grid container item sx={{ justifyContent: "center", overflow: "hidden !important", height: { md: "100vh", xs: "" } }}>
					<Grid container item xs={12} md={8} sx={{ backgroundColor: "#edf2f5" }}>
						<Grid container item xs={12} md={5} sx={{ alignItems: "center" }}>
							<Fade direction="left">
								<Stack mt={{ xs: 5, md: 0 }} textAlign={{ xs: "center", md: "left" }} direction="column" sx={{ bgcolor: "transparent", paddingLeft: "10%", paddingRight: { xs: "10%" } }}>
									<h1 style={{ fontSize: '2.5rem', color: "#34495e", fontWeight: "bold", letterSpacing: 2.5 }}>
										Retrouvez ici les jeunes issus du programme.
									</h1>
									<h4 style={{ fontSize: '1.01rem', color: "#4b5b64", lineHeight: 1.6, marginTop: "20px" }}>
										Vous pouvez filtrer la liste des jeunes en cliquant sur l'une des régions sur la carte ou par promotion, par domaine d'études ou encore par statut professionnel.
									</h4>
								</Stack>
							</Fade>
						</Grid>
						<Grid container item xs={12} md={7}>
							{(!loadingMap && regions.length > 0) ?
								<>
									<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox={matchesQuery ? "-600 0 2000 1600" : "-300 150 1300 1300"} style={{ width: "100%" }}>
										{regions.map((region: any) => (
											<path id={"region" + region.id} className={(regionsActives.includes(region.id) || (isRegionHover && region.id === regionHoverId)) ? 'svg-path active-region' : 'svg-path'}
												aria-owns={openPoper ? 'mouse-over-popover' : undefined} aria-haspopup="true"
												onMouseEnter={(event) => { setIsRegionHover(true); hoverRegion(region.id); handlePopoverOpen(event, region.nom, region.nombre_etudiants) }}
												onMouseLeave={() => { setIsRegionHover(false); handlePopoverClose() }} d={region.path} key={region.id}
												onClick={() => { handleActivesRegions(region.id) }}
											/>
										))}
									</svg>
									<Popover sx={{ pointerEvents: 'none', textAlign: "center" }} anchorEl={anchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
										id="mouse-over-popover" open={openPoper} transformOrigin={{ vertical: 'top', horizontal: 'left' }} onClose={handlePopoverClose} disableRestoreFocus>
										<Stack px={0.5} direction="row" alignItems="center">
											<LocationOnIcon sx={{ color: "#e74c3c" }} />
											<Typography sx={{ p: 1, fontFamily: "product", fontSize: "14.5px" }}>{regionHoverName}</Typography>
										</Stack>
										<Divider />
										{
											regionHoverEff > 0 ?
												<Fab size="large" sx={{ marginY: "8px", backgroundColor: "#16a085", color: "white", boxShadow: "none" }}>
													<h2 style={{ color: "white" }}>{regionHoverEff}</h2>
												</Fab>
												:
												<Fab size="large" sx={{ marginY: "8px", backgroundColor: "white", color: "white", boxShadow: "none" }}>
													<LocationOffIcon sx={{ color: "#34495ec9", fontSize: "40px" }} />
												</Fab>
										}
									</Popover>
								</> : loadingMap ? <Loading type="data" /> : <NoData msg="Aucun données à afficher" />
							}
						</Grid>
					</Grid>
					<Grid item xs={12} md={4} sx={{ justifyContent: "center", backgroundColor: "white" }}>
						<div className="list-header">
							<div className="container-student">
								<h4 style={{ margin: "0px", color: "white", display: "inline" }}>Liste des étudiants</h4>
								<div style={{ display: "inline" }}>
									<HtmlTooltip
										title={
											<Fragment>
												<Typography style={{ fontFamily: "product", padding: "1px", color: "#fff", fontSize: "14px" }}>Effacer les filtres</Typography>
											</Fragment>
										}>
										<FilterAltOffIcon onClick={clearFilter} sx={{ cursor: "pointer", bgcolor: "white", color: "#34495e", padding: "6px", borderRadius: "50px", fontSize: 21 }} />
									</HtmlTooltip>
								</div>
							</div>
							<div className="container-filter" style={{ textAlign: (matchesQuery2 || matchesQuery3) ? "center" : "left" }}>
								{selects.map((sl: any) => (
									<FormControl sx={{ m: 1, width: (matchesQuery2 || matchesQuery3) ? 250 : 150 }} key={sl.id} id={sl.id} >
										<Select
											IconComponent={sl.icon}
											displayEmpty
											multiple
											value={sl.id === "ps" ? promoName : sl.id === "ds" ? filiereName : statusName}
											onChange={(event) => { handleCheckBox(event, sl.id) }}
											input={<OutlinedInput sx={{ color: "white" }} />}
											renderValue={(selected) => {
												if (selected.length === 0) {
													return <h5 style={{ color: "white" }}>{sl.label}</h5>
												}
												return (
													selected.map((value, index) => (
														<h5 style={{ display: "inline", color: "white" }} key={value} >
															{value} {(selected.length > 1 && index !== selected.length - 1) ? <span>,</span> : <span></span>}
														</h5>
													))
												)
											}}
											MenuProps={MenuProps}
											inputProps={{ 'aria-label': 'Without label' }}
											sx={{ fontFamily: "product", maxHeight: "36px !important", textAlign: "left !important" }}
										>
											{
												sl.data?.map((d: any) => {
													if (sl.id !== "ds") {
														return (
															<MenuItem key={d?.id} value={d}>
																<input className="input" type="checkbox"
																	onChange={(event) => { handleCheckBox(event, sl.id) }}
																	checked={
																		sl.id === "ps" ? promoName.includes(d?.nom) :
																			statusName.includes(d?.status)
																	}
																/>
																<span className="checkmark" style={{ marginTop: "7px", marginLeft: "10px" }}></span>
																<span style={{ fontFamily: "product", marginLeft: "25px", fontSize: "14.5px", color: "#4b5b64" }}>
																	{sl.id === "ps" ? d?.nom : d?.status}
																</span>
															</MenuItem>
														)
													}
													else {
														return (
															<Accordion key={d?.id} sx={{ width: "275px" }}>
																<AccordionSummary
																	expandIcon={<ExpandMoreIcon />}
																	aria-controls={d.id + "-content"}
																	id={d.id + "-header"}
																>
																	<h4 style={{ color: "#4b5b64" }}>
																		{d.nom}
																		<small style={{ display: "block", color: "#16a084" }}>
																			<em>
																				{(domainId.filter((item: any) => item === d.id).length > 0 && domainId.filter((item: any) => item === d.id).length === 1) ? "(" + domainId.filter((item: any) => item === d.id).length + " séléctionné)" : ""}
																				{(domainId.filter((item: any) => item === d.id).length > 0 && domainId.filter((item: any) => item === d.id).length !== 1) ? "(" + domainId.filter((item: any) => item === d.id).length + " séléctionnés)" : ""}
																			</em>
																		</small>
																	</h4>
																</AccordionSummary>
																<AccordionDetails sx={{ paddingY: "0px" }}>
																	{
																		d?.liste_filieres?.map((fl: any) => (
																			<MenuItem key={fl.id} value={fl.label} onClick={() => { handleCheckBoxDomain(fl.id, fl.nom, d.id) }}>
																				<input className="input" type="checkbox"
																					onChange={(event) => { handleCheckBox(event, sl.id) }}
																					checked={
																						filiereName.includes(fl.nom)
																					}
																				/>
																				<span className="checkmark" style={{ marginTop: "7px", marginLeft: "10px" }}></span>
																				<span style={{ fontFamily: "product", marginLeft: "25px", fontSize: "14.5px", color: "#34495e" }}>{fl.nom}</span>
																			</MenuItem>
																		))
																	}
																</AccordionDetails>
															</Accordion>
														)
													}
												})
											}
										</Select>
									</FormControl>
								))}
							</div>
						</div>
						<div className="container-list" onScroll={(event) => handleScroll(event)} >
							<div
								style={{ backgroundColor: "#edf2f5", display: matchesQuery ? "grid" : "block" }}
								className="list-etudiant"
								onScroll={(event) => handleScroll(event)}
							>
								{(!loadingEtudiant && etudiants.length > 0) ? etudiants.map((s: any, index) => (
									<div key={index} style={{ paddingRight: matchesQuery ? 15 : 28, marginBottom: matchesQuery ? 0 : 11 }}>
										<Paper elevation={0}
											sx={{
												backgroundColor: "#f9fcf8",
												borderRadius: "10px",
												width: matchesQuery ? "unset" : "100%",
												minHeight: matchesQuery ? "226px" : "unset",
												py: 1.5, px: 2,
												cursor: "pointer"
											}}
										>
											<Grid container alignItems="center">
												<Grid onClick={() => navigate("/portfolio/" + s?.id)} container item xs={12} md={matchesQuery4 ? 3 : 2} order={{ md: matchesQuery4 ? 2 : 1, xs: 2 }} justifyContent={{ xs: "center", md: "start" }}>
													<img src={s?.pdp ? s?.pdp : defaultAvatar} alt="Student" width={matchesQuery4 ? "55" : "60"}
														className={
															`rounded-circle img-thumbnail shadow-sm ${s?.status_professionnel.includes("recherche") ? "searching" :
																s?.status_professionnel.includes("Insérés") ? "inserted" : "student"}`
														}
													/>
												</Grid>
												<Grid
													container item pl={{ xs: 0, md: 0.5 }} xs={12} md={matchesQuery4 ? 9 : 9} order={{ md: matchesQuery4 ? 2 : 2, xs: 3 }}
													justifyContent={{ xs: "center", md: "start" }} textAlign={{ xs: "center", md: "start" }}
												>
													<div>
														<span onClick={() => navigate("/portfolio/" + s?.id)}>
															<h5 style={{ color: "#34495e", lineHeight: 1.5, letterSpacing: 1.25, fontWeight: "bold" }}>{s?.prenoms} {s?.nom}</h5>
															<h5 style={{ color: "#4b5b64", lineHeight: 1, marginTop: 3 }}>
																{
																	s?.status_professionnel.includes("cours") || (s?.status_professionnel.includes("recherche")) ? 
																	(s?.niveau_etude && s?.niveau_etude !== "null") ? s?.niveau_etude + " en " + s?.nom_filiere : s?.nom_filiere : s?.nom_filiere
																}
															</h5>
														</span>
														<Grid container sx={{ alignItems: "center" }} mt={1} justifyContent={{ xs: "center", md: "start" }}>
															<Stack pr={0.5} className="social-icon">
																<LinkedInIcon onClick={() => { openLink(0, s?.linkedin, s?.prenoms) }} sx={{ color: "#4b5b64", border: "1px solid #4b5b6455", fontSize: "1rem", padding: "5px", borderRadius: "50px" }} />
															</Stack>
															<HtmlTooltip
																title={
																	<Fragment>
																		<Typography style={{ fontFamily: "product", padding: "1px", color: "#fff", fontSize: "13px" }}>
																			{s?.email && s?.email?.length > 0 ? s?.email : "Aucun"}
																		</Typography>
																	</Fragment>
																}>
																<Stack px={0.5} className="social-icon">
																	<MailOutlineOutlinedIcon onClick={() => { copyToClipboard(0, s?.email) }} sx={{ color: "#4b5b64", border: "1px solid #4b5b6455", fontSize: "1rem", padding: "5px", borderRadius: "50px" }} />
																</Stack>
															</HtmlTooltip>
															<HtmlTooltip
																title={
																	<Fragment>
																		<Typography style={{ fontFamily: "product", padding: "1px", color: "#fff", fontSize: "13px" }}>
																			{s?.tel1 && s?.tel1?.length > 0 ? s?.tel1 : "Aucun"} {s?.tel2 && s?.tel2?.length > 0 ? ", " + s?.tel2 : ""}
																		</Typography>
																	</Fragment>
																}>
																<Stack px={0.5} className="social-icon">
																	<LocalPhoneRoundedIcon onClick={() => { copyToClipboard(1, [s?.tel1, s?.tel2]) }} sx={{ color: "#4b5b64", border: "1px solid #4b5b6455", fontSize: "1rem", padding: "5px", borderRadius: "50px" }} />
																</Stack>
															</HtmlTooltip>
															<Stack px={0.5} className="social-icon">
																<FacebookIcon onClick={() => { openLink(1, s?.facebook, s?.prenoms) }} sx={{ color: "#4b5b64", border: "1px solid #4b5b6455", fontSize: "1rem", padding: "5px", borderRadius: "50px" }} />
															</Stack>
														</Grid>
													</div>
												</Grid>
												<Grid container item xs={12} md={matchesQuery4 ? 12 : 1} order={{ md: matchesQuery4 ? 1 : 3, xs: 1 }} justifyContent={{ md: matchesQuery4 ? "end" : "center", xs: "end" }}>
													<DownloadIcon onClick={() => { openLink(2, s?.lien_cv, s?.prenoms) }} sx={{ color: "white", backgroundColor: "#34495e", fontSize: "1.2rem", padding: "4px", borderRadius: "50px" }} />
												</Grid>
											</Grid>
										</Paper>
									</div>
								)) : loadingEtudiant ? <Loading type="data" /> : <NoData msg="Aucun étudiants à afficher" />}
								{loadingNextPage ? <Loading type="page" /> : ""}
							</div>
						</div>
					</Grid>
				</Grid>
			</Container>
			<Toastr />
		</>
	);
};


export default Home;