import authHeader from "../../Universal/auth-header";
import axios from 'axios';

class HandleServices{
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

    listTipoFaltas(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "tipo_faltas/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar os tipos de falta'); });
    }

    getCalendario(id_perfil){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "calendario/getUser/" + id_perfil, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a ir buscar o calendário'); });
    }

    listPerfis(){
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
                        return res.data.data;
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