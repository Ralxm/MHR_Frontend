import authHeader from "../../Universal/auth-header";
import axios from 'axios';

class HandleServices {
    listDepartamentos() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "departamento/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todos os departamentos'); });
    }

    listVagas() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "vaga/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as vagas'); });
    }

    createVaga(vaga) {
        let url = process.env.REACT_APP_BACKEND_LINK;

        return axios.post(url + "vaga/create", vaga, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a criar a vaga'); });
    }

    createCandidatura(formData) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data'
        };

        return axios.post(url + "candidaturas/create", formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a criar a candidatura: ' + reason); });
    }

    findResponsavel(id_responsavel) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "perfis/getUtilizador/" + id_responsavel, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data[0];
                }
            }, reason => { throw new Error('Utilizador Inválido'); });
    }
}

export default new HandleServices();