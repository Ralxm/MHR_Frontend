import authHeader from "../../Universal/auth-header";
import axios from 'axios';

class HandleServices{
    carregarProjetos(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "projetos/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar os projetos'); });
    }

    carregarIdeias(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "ideia/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar as ideias'); });
    }

    carregarPerfis() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "perfis/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar os perfis'); });
    }

    criarProjeto(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };
        return axios.post(url + "projetos/create", datapost, {headers})
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a criar o projeto'); });
    }

    criarPerfisProjetos(perfisSelecionados, projetoId) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };
        return axios.post(url + "perfil_projeto/createMany", 
            {
                perfis: perfisSelecionados,
                id_projeto: projetoId
            }, 
            {headers}
        )
        .then(res => {
            if (res.data.success) {
                return res.data.data;
            }
        }, reason => { 
            throw new Error('Erro ao associar perfis ao projeto'); 
        });
    }

    getProjeto(id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "projetos/get/" + id, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar os projetos'); });
    }

    carregarUtilizadores(id) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "perfil_projeto/listByProject/" + id, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar os perfis'); });
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

    criarLinhaTemporal(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };
        return axios.post(url + "linha_temporal/create/", datapost, {headers})
            .then(res => {
                if (res.data.success) {
                    return res.data.data[0];
                }
            }, reason => { throw new Error('Erro a criar o ponto na linha temporal'); });
    }

    carregarLinhaTemporalProjeto(id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "linha_temporal/listProjeto/" + id, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar os pontos da linha temporal'); });
    }

    carregarComentariosProjeto(id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "comentarios_projetos/listProjeto/" + id, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar os comentarios do projeto'); });
    }

    criarComentarioProjeto(formData){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data'
        };

        return axios.post(url + "comentarios_projetos/create", formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a criar o comentário: ' + reason); });
    }

    apagarPontoLinhaTemporalProjeto(id){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.put(url + "linha_temporal/delete/" + id, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a listar os pontos da linha temporal'); });
    }

    updateProjeto(projeto) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };

        return axios.post(url + "projetos/update/" + projeto.id_projeto, projeto, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar o projeto'); });
    }

    atualizarPerfisProjeto(perfisOriginais, perfisAtualizados, projetoId) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };
        
        return axios.put(url + "perfil_projeto/updateMany", 
            {
                originalProfiles: perfisOriginais,
                updatedProfiles: perfisAtualizados,
                id_projeto: projetoId
            }, 
            {headers}
        )
        .then(res => {
            if (res.data.success) {
                return res.data.data;
            }
        })
        .catch(error => { 
            throw new Error('Erro ao atualizar perfis do projeto: ' + error.message); 
        });
    }

    criarIdeia(formData){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data'
        };

        return axios.post(url + "ideia/create", formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar o projeto'); });
        
    }

    atualizarIdeia(formData){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data'
        };

        return axios.post(url + "ideia/update/" + formData.get('id_ideia'), formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar a ideia'); });
    }

    aceitarIdeia(id, id_perfil){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const datapost = {
            id_perfil: id_perfil
        }

        return axios.post(url + "ideia/aceitar/" + id, datapost, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a atualizar a ideia'); });
    }

    apagarIdeia(id, id_perfil){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const datapost = {
            id_perfil: id_perfil
        }

        return axios.post(url + "ideia/rejeitar/" + id, datapost, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a apagar a ideia'); });
    }

    apagarProjeto(id){
        let url = process.env.REACT_APP_BACKEND_LINK;

        return axios.put(url + "projetos/delete/" + id, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a apagar o projeto'); });
    }

    apagarComentario(id){
        let url = process.env.REACT_APP_BACKEND_LINK;

        return axios.put(url + "comentarios_projetos/delete/" + id, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.message;
                }
            }, reason => { throw new Error('Erro a apagar o projeto'); });
        }
}

export default new HandleServices();