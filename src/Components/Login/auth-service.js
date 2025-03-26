import axios from 'axios';

class AuthService{
    
    login(nome_utilizador, password){
        let url = process.env.REACT_APP_BACKEND_LINK;
        return axios.post(url + "utilizadores/login", {nome_utilizador, password, headers: { 'Authorization' : 'Bearer ESTGV'}})
        .then(res => {
            if(res.data.token){
                localStorage.setItem('user', JSON.stringify(res.data));   
                localStorage.setItem("id_utilizador", JSON.stringify(res.data.id_utilizador));
                localStorage.setItem("tipo", JSON.stringify(res.data.tipo));
                localStorage.setItem("nome", JSON.stringify(nome_utilizador));
            }
            return res.data;
        }, reason => {throw new Error('Utilizador Inválido');});
    }

    registo(nome_utilizador, password){
        let url = process.env.REACT_APP_BACKEND_LINK;

        const datapost = {
            id_tipo: 5,
            nome_utilizador: nome_utilizador,
            pass: password,
            estado: "Ativa",
            validade_token: '01-01-1970'
        }

        let datapostAuditLog = {
            data_atividade: getDate(),
            tipo_atividade: "Registo",
            descricao: "Utilizador com nome " + nome_utilizador + " fez registo."
        }

        return axios.post(url + "utilizadores/create", datapost, {headers: { 'Authorization' : 'Bearer ESTGV'}})
        .then(res => {
            axios.post(url + "auditlog/create", datapostAuditLog);
            return res.data;
        }, reason => {throw new Error('Erro a criar o utiliazador na base de dados');});
    }

    recuperar(nome_utilizador){
        let url = process.env.REACT_APP_BACKEND_LINK;

        const datapost = {
            nome_utilizador: nome_utilizador,
        }

        let datapostAuditLog = {
            data_atividade: getDate(),
            tipo_atividade: "Recuperação de password",
            descricao: "Utilizador com nome " + nome_utilizador + " iniciou uma recuperação de password."
        }

        return axios.post(url + "utilizadores/resgatepassword", datapost, {headers: { 'Authorization' : 'Bearer ESTGV'}})
        .then(res => {
            axios.post(url + "auditlog/create", datapostAuditLog);
            return res.data;
        }, reason => {throw new Error('Erro a criar o utiliazador na base de dados');});
    }

    alterar(nome_utilizador, password, token){
        let url = process.env.REACT_APP_BACKEND_LINK;

        const datapost = {
            nome_utilizador: nome_utilizador,
            token: token,
            newPassword: password
        }

        let datapostAuditLog = {
            data_atividade: getDate(),
            tipo_atividade: "Alteração de password",
            descricao: "Utilizador com nome " + nome_utilizador + " alterou a password com o token."
        }

        return axios.post(url + "utilizadores/resetpassword", datapost, {headers: { 'Authorization' : 'Bearer ESTGV'}})
        .then(res => {
            axios.post(url + "auditlog/create", datapostAuditLog);
            return res.data;
        }, reason => {throw new Error('Erro a alterar a password');});
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('id_utilizador');
        localStorage.removeItem('tipo');
        localStorage.removeItem('nome');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isLoggedIn(){

    }
}

function getDate(){
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    let today = `${yyyy}-${mm}-${dd}`;
    return today;
}

export default new AuthService;