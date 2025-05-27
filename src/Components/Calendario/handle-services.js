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
            'Content-Type': 'multipart/form-data',
        };

        return axios.post(url + "faltas/create", formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data;
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

    carregarFerias() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "ferias/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as ferias'); });
    }

    carregarFeriasAprovadas(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "ferias/listAprovadas", authHeader())
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
        return axios.post(url + "faltas/update/" + formData.get('id_falta'), formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => {
                throw new Error('Erro a atualizar o pedido de férias');
            });
    }

    atualizarFeria(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json'
        };
        return axios.post(url + "ferias/update/" + datapost.id_solicitacao, datapost, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
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
            }, reason => { throw new Error('Erro a criar o pedido de férias: ' + reason); });
    }

    apagarFeria(id_solicitacao){
        let url = process.env.REACT_APP_BACKEND_LINK;

        return axios.put(url + "ferias/delete/" + id_solicitacao, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a apagar o pedido de férias ' + reason); });
    }

    apagarFalta(id_falta){
        let url = process.env.REACT_APP_BACKEND_LINK;

        return axios.put(url + "faltas/delete/" + id_falta, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a apagar a falta: ' + reason); });
    }

    find_perfil(id_utilizador) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "perfis/getUtilizador/" + id_utilizador, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data[0];
                }
            }, reason => { throw new Error('Erro a encontrar o perfil'); });
    }

    apagarTipoFalta(id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.put(url + "tipo_faltas/delete/" + id, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a apagar o tipo de falta'); });
    }

    criarTipoFalta(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.post(url + "tipo_faltas/create", datapost, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a criar o tipo de falta'); });
    }

    atualizarTipoFalta(id, datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.post(url + "tipo_faltas/update/" + id, datapost, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar o tipo de falta'); });
    }

    CriarManyFaltas(faltas){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.post(url + "faltas/createMany", faltas, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data;
                }
            }, reason => { throw new Error('Erro a criar varias faltas'); });
    }

    carregarFeriados(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "feriados/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas os feriados'); });
    }

    apagarFeriado(id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.put(url + "feriados/delete/" + id, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a apagar o feriado'); });
    }

    criarFeriado(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };

        return axios.post(url + "feriados/create", datapost, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a criar o feriado: ' + reason); });
    }

    atualizarFeriado(id, datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };

        return axios.post(url + "feriados/update/" + id, datapost, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar o feriado: ' + reason); });
    }
}

export default new HandleServices();