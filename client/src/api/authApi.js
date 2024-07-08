import axios from "axios";

const url = `${process.env.REACT_APP_API}/auth`;

export const createPassword = password => axios.post(`${url}/createPassword`, { password: password });

export const accessWallet = (keystore, password) => axios.post(`${url}/accessWallet`, { keystore: keystore, password: password });