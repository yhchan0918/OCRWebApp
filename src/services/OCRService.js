import Api from "@/services/Api";
export default {
  submitFile(files, onUploadProgress) {
    //Initialize the form data
    let formData = new FormData();
    //Iteate over any file sent over appending the files to the form data.
    formData.append("file", files);
    //Make the request to the POST /multiple-files URL
    return Api().post("/", formData, { onUploadProgress });
  },
};
