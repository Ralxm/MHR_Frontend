import authHeader from "../../Universal/auth-header";
import axios from 'axios';

class HandleServices {
    listFerias(id_perfil) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "ferias/listUser/" + id_perfil, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as ferias'); });
    }

    listFaltas(id_perfil) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "faltas/listUser/" + id_perfil, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as faltas'); });
    }

    listTipoFaltas() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "tipo_faltas/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar os tipos de falta'); });
    }

    getCalendario(id_perfil) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "calendario/listUser/" + id_perfil, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a ir buscar o calendário'); });
    }

    listPerfis() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "perfis/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar os perfis'); });
    }

    createFalta(formData) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };

        return axios.post(url + "faltas/create", formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a criar o comentario: ' + reason); });
    }

    carregarFaltas(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "faltas/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as faltas'); });
    }

    carregarFaltasPessoais(id_perfil){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "faltas/listUser/" + id_perfil, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as faltas'); });
    }

    atualizarFalta(formData){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data'
        };
        console.log(formData)
        return axios.post(url + "faltas/update/" + formData.get('id_falta'), formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => {
                throw new Error('Erro a atualizar a falta');
            });
    }

    getFeriasUser(id_perfil){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "ferias/listUser/" + id_perfil, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as faltas'); });
    }

    createFerias(formData) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };

        return axios.post(url + "ferias/create", formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a criar o comentario: ' + reason); });
    }

    apagarFeria(id_solicitacao){
        let url = process.env.REACT_APP_BACKEND_LINK;

        return axios.put(url + "ferias/delete/" + id_solicitacao, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a criar o comentario: ' + reason); });
    }

    find_perfil(id_utilizador) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "perfis/getUtilizador/" + id_utilizador, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data[0];
                }
            }, reason => { throw new Error('Utilizador Inválido'); });
    }
}

export default new HandleServices();