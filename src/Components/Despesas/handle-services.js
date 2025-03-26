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

    createDespesa(id_perfil, date, descricao, valor, ficheiro) {
        let url = process.env.REACT_APP_BACKEND_LINK;

        let datapost = {
            id_perfil: id_perfil,
            _data: date,
            descricao: descricao,
            valor: valor,
            estado: "Pendente"
        }

        return axios.post(url + "despesas/create", datapost, authHeader())
            .then(res => {
                console.log(res)
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

    listDespesasPorAprovar() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "despesas/listPorAprovar", authHeader())
            .then(res => {
                if (res.data.success) {
                    const formattedData = res.data.data.map(item => ({
                        ...item,
                        data: item.data.replace('T', ' ').replace(/\.\d+Z$/, '')
                    }));
                    console.log(formattedData)
                    return formattedData;
                }
            }, reason => { throw new Error('Erro a listar todas as despesas por aprovar'); });
    }
}

export default new HandleServices;