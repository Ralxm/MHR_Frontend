import authHeader from "../../Universal/auth-header";
import axios from 'axios';

class HandleServices{
    find_perfil(id_utilizador) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "perfis/getUtilizador/" + id_utilizador, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data[0];
                }
            }, reason => { throw new Error('Utilizador Inválido'); });
    }

    carregarEmpresa(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "empresa/get", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a carregar a empresa'); });
    }

    atualizarEmpresa(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.post(url + "empresa/update", datapost, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar as informações empresa'); });
    }

    carregarUtilizadores(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "utilizadores/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a carregar os utilizadores'); });
    }

    carregarCandidaturas(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "candidaturas/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a carregar as candidaturas'); });
    }

    carregarPerfis(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "perfis/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a carregar os perfis'); });
    }

    carregarDepartamentos(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "departamento/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a carregar os departamentos'); });
    }

    atualizarPerfil(perfilData, id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json'
        };
        return axios.post(url + "perfis/update/" + id, perfilData, {headers})
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar o perfil'); });
    }

    criarDepartamento(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json'
        };
        return axios.post(url + "departamento/create", datapost, {headers})
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a criar o departamento'); });
    }

    atualizarDepartamento(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json'
        };
        return axios.post(url + "departamento/update/" + datapost.id_departamento, datapost, {headers})
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar o departamento'); });
    }

    apagarDepartamento(id){
        let url = process.env.REACT_APP_BACKEND_LINK;

        return axios.put(url + "departamento/delete/" + id, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a criar o departamento'); });
    }

    criarPerfil(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json'
        };
        return axios.post(url + "perfis/create", datapost, {headers})
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar o departamento'); });
    }

    carregarAuditLog(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "auditlog/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a carregar os departamentos'); });
    }
}

export default new HandleServices();