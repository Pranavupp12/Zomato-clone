import React from "react";
import "./Verify.css";
import { useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Verify = () => {
  const [searchparams, setSearchParams] = useSearchParams();
  const success = searchparams.get("success");
  const orderId = searchparams.get("orderId");
  console.log(success, orderId);
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    const response = await axios.post(url + "/api/order/verify", {
      success,
      orderId,
    });
    if (response.data.success) {
      navigate("/myorders");
    } else {
      navigate("/");
    }
  };
  useEffect(() => {
    verifyPayment();
  });

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
