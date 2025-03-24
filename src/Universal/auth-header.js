export default function authHeader() {
    let token;
    
    try{
        let user = localStorage.getItem('user');
        let userData = JSON.parse(user);
        token = userData.token;
    }
    catch{
        console.log("Erro a ir buscar o token");
    }
    if (token) {
        return {headers: { 'Authorization' : 'Bearer ' + token }}
    } else {
        return {};
    }
}