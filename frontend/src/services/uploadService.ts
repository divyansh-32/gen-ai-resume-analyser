import {API} from "./auth";

export const uploadFileWithJD = (file: File, jd: string) => {
    const formData = new FormData();
    formData.append("jd", jd);
    formData.append("file", file);
  
    return API.post("/upload-resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
}