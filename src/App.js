
import './App.css';
import axios from 'axios';
import {useState, useEffect} from 'react'

import styled from 'styled-components';

// importing apiProvider for api calls
import { apiProvider } from './apis/provider';
function App() {

  
  // for storing users data
  let[users , setUsers] = useState();

  // for storing tasks fetched from api
  let [tasks, setTasks] = useState();

  // for storing values of inputs and giving them an initial state
  let [inputs, setInputs] = useState({
    message: '',
    due_date: '',
    priority: '',
    taskid: '',
  }

);  
  // to change on when create_btn is clicked
  let [create, setCreate] = useState(false);

  // to change on when update_btn is clicked
  let [UpdateDone, setUpdateDone] = useState(true);

  // tasks for the user that is in the window
  let [activeUserTasks, setActiveUserTasks]  = useState();

  // proivders
  let getList = apiProvider.getList;
  let createTask = apiProvider.createTask;
  let requestTask = apiProvider.requestTask;
  let deleteTask = apiProvider.deleteTask;
  let update = apiProvider.update;
  let formData = apiProvider.formData;

   // to initiate diff. func's whenever updatedTask is set to false
  let [updatedTask, setUpdatedTask] = useState(true);

  // to show the selected user inside the window
  let [id, setId] = useState(0);
 
  //  fetching users list
  useEffect(() => {
    axios(getList)
    .then((response) => {
      let data;
        data = response.data;
        setUsers(data.users);
      
    })
    .catch( (error) => {
        console.log(error);
      })
    
  }, [getList])

  // fetching tasks and storing them in tasks state
  useEffect(() => {
   
    let controller = new AbortController();
       async function fetchTasks() {
        try{
          const response =  await fetch("https://devza.com/tests/tasks/list", requestTask, {signal: controller.signal})
          const result = await response.text()
          setTasks( await JSON.parse(result).tasks)
       
        } 

        catch (e){
         console.log('error', e)
        }

    }
    fetchTasks()
    setUpdatedTask(true)
    
  
    return () => {
      controller?.abort();
    
  }
  },[updatedTask, requestTask])

  // checking if users and tasks are present, if true than storing the crr user acc the id variable inside ActiveUserTasks
  useEffect(() => {
    if(users && tasks){
    
      let sorted = (users.map(user => ({ [user.name]: tasks.map((task) => task.assigned_to === user.id && {'message' :task.message, 'due_date': task.due_date, 'id': task.id, 'priority': task.priority})})))
      let crrUser = sorted.map(user =>(Object.keys(user)));
      let crrUserObj = sorted.map(user =>user[crrUser[id]] &&  user[crrUser[id]] );
    
      setActiveUserTasks(crrUserObj.filter(data => data && data.map(inner => inner)))
      
      }
  },[users,tasks,id])
 
  // delete button event
  let deleteT =(id) => {

    formData.append('taskid', id)
   
    fetch("https://devza.com/tests/tasks/delete", deleteTask)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    
    setUpdatedTask(!updatedTask)
  }  

  //  update button event
  let UpdateFunc = (taskId) => {
   
    formData.append("message", inputs.message);
    formData.append("due_date",inputs.due_date);
    formData.append("priority", inputs.priority);
    formData.append("assigned_to",id + 1);
    formData.append("taskid", taskId);

    fetch("https://devza.com/tests/tasks/update", update)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));


    setUpdatedTask(!updatedTask)
    setUpdateDone(!UpdateDone)
  }

  // input controller
  let handleChange =(e) =>{
    setInputs({...inputs,[e.target.name]: e.target.value})
  }

  // submit button event
  let handleSubmit = () => {
    
  formData.append("message", inputs.message);
  formData.append("due_date",inputs.due_date);
  formData.append("priority", inputs.priority);
  formData.append("assigned_to",id + 1);

  fetch("https://devza.com/tests/tasks/create", createTask)
  .then(response => response.text())
  .then(result => console.log('success:' ,result))
  .catch(error => console.log('error:', error));



  setUpdatedTask(!updatedTask)
  setCreate(!create);

  }










  return (
    <div className="App">
      
     <SpanContainer>{users && users.map(user =><span className='users'   onClick={() => setId(user.id - 1)}>{user.name}</span>)}</SpanContainer>
     {activeUserTasks && (activeUserTasks[0].filter(t => t ).map(m => <Div priority={m.priority} key={m.id}><p>{m.message}</p> 
     <div>{UpdateDone ? <button onClick={() => setUpdateDone(!UpdateDone)}>
        Update
      </button> : <Form onSubmit={() => UpdateFunc(m.id)}>
        
        <label htmlFor="message"> Meassage</label>
        <input id='message' type='text' name='message' value={inputs.message} onChange={handleChange}></input>

      
        <label htmlFor='due_date'>Due Date</label>
        <input id='due_date' type='text' name='due_date' value={inputs.due_date} onChange={handleChange}></input>
     

       
        <label htmlFor="priority">Priority</label>
        <input id="priority" type='text' name='priority' value={inputs.priority} onChange={handleChange}></input>
       

         <input className='common blue'type='submit' ></input>
      <button className='common red' onClick={() => setUpdateDone(!UpdateDone)}>Cancel</button>
    </Form> }
     <button onClick={() => deleteT(m.id)}>
      Delete </button></div></Div>))}
    {create ?
      <Form onSubmit={handleSubmit}>
        
          <label htmlFor="message"> Meassage</label>
          <input id='message' type='text' name='message' value={inputs.message} onChange={handleChange}></input>

        
          <label htmlFor='due_date'>Due Date</label>
          <input id='due_date' type='text' name='due_date' value={inputs.due_date} onChange={handleChange}></input>
       

         
          <label htmlFor="priority">Priority</label>
          <input id="priority" type='text' name='priority' value={inputs.priority} onChange={handleChange}></input>
         

           <input className='common blue'type='submit' ></input>
        <button className='common red' onClick={() => setCreate(!create)}>Cancel</button>
      </Form> 
        :
         <CreateBtn onClick={(() => setCreate(!create) )}>Create Task
        </CreateBtn>
     }



        </div>
  );
}

// stying with styled components

  const SpanContainer = styled.div`
      padding:20px;
      background:#000;
      color:#fff;
      display:flex;
      justify-content:space-between;

      .users:hover{
        cursor: pointer;
        color: #ddd;
      }

    
  `


  const Form = styled.form`
    text-transform:uppercase;
    font-family:Helvetica;
    font-size:15px;
    position: absolute;
    width:100vw;
    height: 100vh;
    top:0;
    left:0;
    background-color:rgb(25,25,25);
    dispaly:flex;
    color:rgb(220,220,220);

    
      padding:20px;
      input, button{
        width:100%;
        margin:20px auto;
        heighT:30px;
        background-color:rgb(220,220,220);
        font-family:Helvetica;
        font-size:15px;
        padding-left:10px;
        transition: all .3s;
      }
      
      button
      {
        margin:0;
      
      }
      .common{
        width:40%;
      }
      .common:hover{
        width:50%;
        cursor:pointer;
      
        color:#fff;
        border:none;
        
      }
      .blue:hover{
        background:rgb(20,120,237);
        }
        .red:hover{
          background:#b02321;
        }
      
  `
  const Div = styled.div`
    background-color: #effe4;
    display:flex;
    justify-content:space-between;
    color:rgb(0,0,0);
    font-weight:400;
    text-transform:uppercase;
    font-family:Helvetica;
    font-size:20px;
    padding:20px;
    border-bottom:solid 5px ${props => (props.priority === '1' && '#a3de83') || (props.priority === '2' && '#2eb872') || (props.priority === '3' && '#fa4659')};


  `
  const CreateBtn = styled.button`
      display:flex;
      padding:20px 40px;
      box-styling:none;
      margin:50px auto;
      border:none;
      font-family:helvetica;
      font-size:18px;
      text-transform:uppercase;
      font-weight:400;
      background-color:#24a0ed;
      color:#fff;
      letter-spacing:1px;
      border-radius:5px;
      transition: .3s all;
      :hover{
        background-color:rgb(20,120,237);
        cursor:pointer;
        
      }


  `

export default App;
