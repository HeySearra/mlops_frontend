import { Message, MessageBox } from 'element-ui'
export const alert_msg = {
    success: function(msg) {
        Message({
            showClose: true,
            message: msg,
            region: 'success'
        });
    },
    error: function(msg) {
        Message({
            showClose: true,
            message: msg,
            region: 'error'
        });
    },
    warning: function(msg) {
        Message({
            showClose: true,
            message: msg,
            region: 'warning'
        });
    },
    normal: function(msg) {
        Message({
            showClose: true,
            message: msg,
        });
    }
}

export const login_manager = {
    set: function(state, token, name, email){
        if(state){
            localStorage.setItem('state', state);
            if(token)localStorage.setItem('token', token);
            if(name)localStorage.setItem('name', name);
            if(email)localStorage.setItem('email', email);
        }
        else{
            localStorage.setItem('state', false);
        }
    },
    get: function(){
        if(localStorage.getItem('state')){
            return true;
        }
        else{
            return false;
        }
    },
    clear: function(){
        localStorage.removeItem('state');
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
    },
    get_token: function(){
        return localStorage.getItem('token');
    },
    get_name: function(){
        return localStorage.getItem('name');
    },
    get_email: function(){
        return localStorage.getItem('email');
    }
}