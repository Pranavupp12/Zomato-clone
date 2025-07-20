import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



const PlaceOrder = () => {

  const {getTotalCartAmount,token,food_list,cartItems,url}=useContext(StoreContext);

  const[data,setData]=useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

const onChangeHandler = (event)=> {
const name = event.target.name;
const value = event.target.value;

setData(data=>({...data,[name]:value}))

}

const placeOrder = async (event)=>{
event.preventDefault();
let orderItems =[];
food_list.map((item)=>{
  if (cartItems[item._id]>0) {
    let itemInfo = item;
    itemInfo["quantity"]=cartItems[item._id]
    orderItems.push(itemInfo)

  }
})

let orderData = {
  address:data,
  items:orderItems,
  amount:getTotalCartAmount()+2,
}

try{
let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
if (response.data.success) {
 const {session_url} = response.data;
 window.location.replace(session_url)
}
else{
  console.error("Order failed:", response.data);
  alert(`Error: ${response.data.message || "Order placement failed"}`);
}
}
catch(error){
console.error("Network/API Error:", error);
    if (error.response) {
      // Server responded with error status
      console.error("Error Response Data:", error.response.data);
      console.error("Error Status:", error.response.status);
      alert(`Server Error: ${error.response.data.message || error.response.status}`);
    } else if (error.request) {
      // Request made but no response received
      console.error("No response received:", error.request);
      alert("Network Error: No response from server");
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
      alert(`Request Error: ${error.message}`);
    }
  }
}

const navigate = useNavigate()

useEffect(()=>{
 if (!token) {
  navigate("/cart")
 }
 else if(getTotalCartAmount()===0){
navigate("/cart")
 }
},[token])

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='first name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName }type="text" placeholder='last name' />
        </div>
        <input required type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='email address' />
        <input required type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='street' />
         <div className="multi-fields">
          <input required type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='city' />
          <input required type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='state' />
        </div>
         <div className="multi-fields">
          <input required type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='zip code' />
          <input required type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='country' />
        </div>
        <input type="text" placeholder='phone' name='phone' onChange={onChangeHandler} value={data.phone} />
      </div>
      <div className="place-order-right">
       <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0:getTotalCartAmount()+2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder