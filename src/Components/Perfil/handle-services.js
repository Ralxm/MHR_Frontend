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

    find_user(id_utilizador) {
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.get(url + "utilizadores/get/" + id_utilizador, authHeader())
            .then(res => {
                if (res.data.success) {
                    return res.data.data[0];
                }
            }, reason => { throw new Error('Utilizador Inválido'); });
    }
}

export default new HandleServices();