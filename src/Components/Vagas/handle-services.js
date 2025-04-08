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

    updateVaga(vaga) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        console.log(vaga)
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };

        return axios.post(url + "vaga/update/" + vaga.id_vaga, vaga, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a editar a vaga'); });
    }

    deleteVaga(id_vaga) {
        let url = process.env.REACT_APP_BACKEND_LINK;

        return axios.put(url + "vaga/delete/" + id_vaga, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a apagar a vaga'); });
    }

    listCandidaturas() {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "candidaturas/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as vagas'); });
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
                    console.log(res)
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a criar a candidatura: ' + reason); });
    }

    getVaga(id_vaga) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "vaga/get/" + id_vaga, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as vagas'); });
    }

    getVaga(id_vaga) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "vaga/get/" + id_vaga, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as vagas'); });
    }

    listCandidaturasPorVaga(id_vaga){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "candidaturas/listVaga/" + id_vaga, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as vagas'); });
    }

    createComentario(formData) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'application/json',
        };
        console.log(formData)

        return axios.post(url + "comentarios/create", formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a criar o comentario: ' + reason); });
    }

    listComentarios(id_candidatura){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "comentarios/listCandidatura/" + id_candidatura, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as vagas'); });
    }

    getCandidaturaUser(id_user, id_vaga) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "candidaturas/listUser/" + id_user, authHeader())
            .then(res => {
                const found = res.data.data.find(candidatura => candidatura.id_vaga == id_vaga);
                if (found) {
                    return found;
                }
                return null;
            })
            .catch(err => {
                console.error('Erro a listar a candidatura feita pelo utilizador', err);
                throw err;
            });
    }

    atualizarCandidatura(formData){
        let url = process.env.REACT_APP_BACKEND_LINK;
        const headers = {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data'
        };
        console.log(formData)
        return axios.post(url + "candidaturas/update/" + formData.get('id_candidatura'), formData, { headers })
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => {
                throw new Error('Erro a atualizar a despesa');
            });
    }

    aceitarCandidatura(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.post(url + "candidaturas/aceitar/" + datapost.id_candidatura, datapost, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => {
                throw new Error('Erro a atualizar a despesa');
            });
    }

    analisarCandidatura(id_candidatura){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.post(url + "candidaturas/analisar/" + id_candidatura, null, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => {
                throw new Error('Erro a atualizar a despesa');
            });
    }

    rejeitarCandidatura(datapost){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.post(url + "candidaturas/rejeitar/" + datapost.id_candidatura, datapost, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => {
                throw new Error('Erro a atualizar a despesa');
            });
    }

    getDepartamento(id_departamento){
        let url = process.env.REACT_APP_BACKEND_LINK;

        return axios.get(url + "departamento/get/" + id_departamento, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => {
                throw new Error('Erro a ir buscar o departamento');
            });
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