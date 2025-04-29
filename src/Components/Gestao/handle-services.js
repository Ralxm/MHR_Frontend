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

    carregarBlog(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "blog/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar as publicações'); });
    }

    criarPublicacao(formData){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data'
        };

        return axios.post(url + "blog/create", formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a criar a publicação no blog'); });
    }

    aceitarPublicacao(id, id_perfil){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const datapost = {
            id_perfil: id_perfil
        }

        return axios.post(url + "blog/aceitar/" + id, datapost, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a aprovar a publicação'); });
    }

    rejeitarPublicacao(id, id_perfil){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const datapost = {
            id_perfil: id_perfil
        }

        return axios.post(url + "blog/rejeitar/" + id, datapost, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a rejeitar a publicação'); });
    }

    getPublicacao(id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "blog/get/" + id, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a ir buscar a publicação'); });
    }

    ver(id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.put(url + "blog/view/" + id, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a acrescentar a visualização'); });
    }

    editarPublicacao(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json'
        };

        return axios.post(url + "blog/update/" + datapost.id_publicacao, datapost, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data;
                }
            }, reason => { throw new Error('Erro a editar a publicação'); });
    }

    apagarPublicacao(id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.put(url + "blog/delete/" + id, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a apagar a publicação'); });
    }

    ////////////////////////////////////////////

    atualizarPerfil(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json'
        };

        return axios.post(url + "perfis/update/" + datapost.id_perfil, datapost, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a editar o perfil'); });
    }
}

export default new HandleServices();