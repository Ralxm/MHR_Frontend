import authHeader from "../../Universal/auth-header";
import axios from 'axios';

class HandleServices {
    find_perfil(id_utilizador) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "perfis/getUtilizador/" + id_utilizador, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data[0];
                }
            }, reason => { throw new Error('Utilizador Inválido'); });
    }

    createDespesa(formData) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data'
        };

        return axios.post(url + "despesas/create", formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Utilizador Inválido'); });
    }

    listDespesas(id_perfil) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "despesas/listUser/" + id_perfil, authHeader())
            .then(res => {
                if (res.data.success) {
                    const formattedData = res.data.data.map(item => ({
                        ...item,
                        data: item.data.replace('T', ' ').replace(/\.\d+Z$/, '')
                    }));
                    return formattedData;
                }
            }, reason => { throw new Error('Erro a listar todas as despesas do utilizador'); });
    }

    listDespesasGestao() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "despesas/listGestao", authHeader())
            .then(res => {
                if (res.data.success) {
                    const formattedData = res.data.data.map(item => ({
                        ...item,
                        data: item.data.replace('T', ' ').replace(/\.\d+Z$/, '')
                    }));
                    return formattedData;
                }
            }, reason => { throw new Error('Erro a listar todas as despesas por aprovar'); });
    }

    listDespesasHistorico() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "despesas/listHistorico", authHeader())
            .then(res => {
                if (res.data.success) {
                    const formattedData = res.data.data.map(item => ({
                        ...item,
                        data: item.data.replace('T', ' ').replace(/\.\d+Z$/, '')
                    }));
                    return formattedData;
                }
            }, reason => { throw new Error('Erro a listar todas as despesas por aprovar'); });
    }

    apagarDespesa(id_despesa) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
        };
        return axios.put(url + "despesas/delete/" + id_despesa, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a apagar a despesa'); });
    }

    atualizarDespesa(despesa) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data'
        };
        return axios.post(url + "despesas/update/" + despesa.get('id_despesa'), despesa, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => {
                throw new Error('Erro a atualizar a despesa');
            });
    }
}

export default new HandleServices;