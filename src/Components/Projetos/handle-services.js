import authHeader from "../../Universal/auth-header";
import axios from 'axios';

class HandleServices{
    loadProjetos(){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "projetos/list", authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data;
                }
            }, reason => { throw new Error('Erro a listar todas as ferias'); });
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