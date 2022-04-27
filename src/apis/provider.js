
import FormData from 'form-data';



const Token = 'UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a';
let myHeaders = new Headers();
myHeaders.append("AuthToken", Token);
let formData = new FormData()
let getList = {
         
    method:'get',
    url: 'https://devza.com/tests/tasks/listusers',
    headers: {
        'AuthToken': Token
    },
};

let deleteTask = {
        method: 'POST',
        headers: myHeaders,
        body: formData,
        redirect: 'follow'
    }
    


let requestTask = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

let createTask = {
       
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow'
    
    
}
let update = {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow'
  };
export const apiProvider = {
    getList,
    deleteTask,
    requestTask,
    createTask,
    formData,
    update
}