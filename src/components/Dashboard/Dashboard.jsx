
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { BASEURL } from "../constant/constant";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {

  const [image, setImage] = useState(null);
  const [catId, setCatId] = useState('');
  const [subCatId, setSubCatId] = useState('');
  const [catList, setCatList] = useState([]);
  const [subCatList, setSubCatList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const handelImageChange = (e)=>{
      const file = e.target.files[0];
     setImage(file)
  }

  const fetchCategory = async () => {
      try {
        const response = await axios.get(`${BASEURL}/getCategory`);
        setCatList(response.data);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    const fetchSubCategory = async (id) => {
      //console.log("inside subcat",catId)
      try {
        const response = await axios.post(`${BASEURL}/getSubCategory`,{catId:id});
        console.log(response)
        setSubCatList(response.data);
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

   useEffect(()=>{
      fetchCategory();
   },[]) 

   const handelSubmit = async()=>{
      // console.log(catId,image)
      if(!catId){
          alert("Please select category");
          return;
      }
      if(!subCatId){
        alert("Please select sub category");
        return;
    }
      if(!image){
        alert("Please select Image");
        return;
    }
      const formData = new FormData();
      formData.append('image', image);
      formData.append('userId',1234);
      formData.append('catId', catId)
      formData.append('subCatId', subCatId);
  
      try {
       const res =  await axios.post(`${BASEURL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if(res.status === 200){
          alert("Image uploaded successfully")
          setImage('')
          fetchImages();
        }
        console.log("inside image uplaod",res);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
   }
   
   const fetchImages = async () => {
    if(!subCatId){
      return;
    }
  try {
    const response = await axios.post(`${BASEURL}/getImages`,{subCatId});
    //setImages(response.data);
    if(response.status == 200){

      //setSelectedImage(response.data[0].image_name)
      setImageList(response.data)
    }
    
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};


useEffect(()=>{
fetchImages();
},[subCatId])

const handelDeleteImage = async (Id)=>{
    
  try {
      const res = await axios.post(`${BASEURL}/deleteImage`, {imgId:Id});
      if(res.status === 200){
        fetchImages();
      }
  } catch (error) {
    console.log(error);
  }
}

const handleRemoveImage = ()=>{
   setImage('')
}

  return  (
    <div>
      <main id="main" className="main">
      <div>
         
         <div className="row">
         <div className="d-sm-flex align-items-center justify-content-end mb-4">
         
          <select
          className="form-control"
           onChange={(e)=>{
              setCatId(e.target.value)
              setSubCatId('')
              fetchSubCategory(e.target.value);
          }} 
          value={catId}> 
              <option value=''>Select Category</option>
              {catList.map((cat) => (
            <option key={cat.cat_id} value={cat.cat_id}>
              {cat.cat_name}
            </option>
          ))} 
          
          </select>

         <select 
          className="form-control"
         onChange={(e)=>{
          
            setSubCatId(e.target.value)
         }} 
         value={subCatId}> 
            <option value=''>Select SubCategory</option>
            {subCatList && subCatList.length>0 && subCatList.map((cat) => (
              <option key={cat.subcat_id} value={cat.subcat_id}>
            {cat.subcat_name}
          </option>
        ))} 
        
         </select>
           </div>
         </div>
         <label
                          htmlFor="fileInput"
                          className="form-label custom-file-label"
                         
                        >
                        choose file
         </label>
         <input type="file" accept="image/png, image/jpeg"
          id="fileInput"
          className="file-input"
           onChange={handelImageChange}/>
         
        
         {image && <div
                            
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <img
                              src={image && URL.createObjectURL(image)}
                              alt="Preview"
                              style={{ width: "100px", height: "130px" }}
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                background: "#07070742",
                                color: "white",
                                border: "none",
                                padding: "0px 4px",
                                cursor: "pointer",
                              }}
                            >
                              X
                            </button>
         </div>}

         <button  className="btn btn-success mt-2 d-block" onClick={handelSubmit}>Upload</button>

         <div style={{display:"flex", gap:"20px", margin:"10px"}}>
             {imageList && imageList.length>0 && imageList.map((e)=>(
               <div  key={e.imid}>
                   <img style={{height:"200Px", width:"150px"}} src={`${BASEURL}/uploads/${e.image_name}`} crossOrigin=''></img>
                   <button className="btn btn-success m-auto" onClick={()=>{handelDeleteImage(e.imid)}} style={{display:"block"}}>Delete</button>
               </div>
             ))}
         </div>
    </div>
      </main>
    </div>
  );
};

export default Dashboard;
