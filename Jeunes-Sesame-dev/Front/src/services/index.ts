import axios from "axios";
import { environment } from "./environment";


export default class BaseService {

	static baseUrl: string = environment.apiUrl;

	static async getAllRegions() {
		var data: any;
		await axios.get(this.baseUrl + "regions/all").then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async getEtudiants(filters: any, pageNumber : number) {
		var data: any;

		if (filters) {
			await axios.post(this.baseUrl + "etudiants/filtre?page="+pageNumber+"&limit=20", filters).then((response) => {
				if (response.status === 200) {
					data = response.data;
				}
			}).catch((error) => {
				throw error
			});
			return data;
		}
		else {
			await axios.get(this.baseUrl + "etudiants/all?page="+pageNumber+"&limit=20").then((response) => {
				if (response.status === 200) {
					data = response.data;
				}
			}).catch((error) => {
				throw error
			});
			return data;
		}
	}

	static async getAllPromotions() {
		var data: any;

		await axios.get(this.baseUrl + "promotions/all").then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async getAllDomainesFilieres() {
		var data: any;

		await axios.get(this.baseUrl + "domaine-competences/all").then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async getAllStatusPro() {
		var data: any;

		await axios.get(this.baseUrl + "status-professionnels/all").then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async getOneEtudiant(id: number) {
		var data: any;

		await axios.get(this.baseUrl + "etudiants/" + id).then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async getCompetencesEtudiant(id: number) {
		var data: any;

		await axios.get(this.baseUrl + "competences/etudiants/" + id).then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async getExperiencesEtudiant(id: number) {
		var data: any;

		await axios.get(this.baseUrl + "experiences/etudiants/" + id).then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async getFormationsEtudiant(id: number) {
		var data: any;

		await axios.get(this.baseUrl + "formations/etudiants/" + id).then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async getDistinctionsEtudiant(id: number) {
		var data: any;

		await axios.get(this.baseUrl + "distinctions/etudiants/" + id).then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async getRealisationsEtudiant(id: number) {
		var data: any;

		await axios.get(this.baseUrl + "projets/etudiants/" + id).then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

	static async setPopularityEtudiant(id : number) {
		var data: any;

		await axios.patch(this.baseUrl + "etudiants/popularity/" + id).then((response) => {
			if (response.status === 200) {
				data = response.data;
			}
		}).catch((error) => {
			throw error
		});
		return data;
	}

}