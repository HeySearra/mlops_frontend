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