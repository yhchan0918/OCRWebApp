import axios from "axios";

export default () => {
  return axios.create({
    baseURL: `https://api.ocr.space/parse/image`,
    headers: {
      "Content-Type": "multipart/form-data",
      apiKey: "ec2a41c6a188957",
    },
  });
};
