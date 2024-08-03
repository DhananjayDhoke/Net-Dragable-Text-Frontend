import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BASEURL } from "../constant/constant";
//import * as fabric from 'fabric';
import { fabric } from "fabric";
const ImageSection = () => {
  const [canvas, setCanvas] = useState(null);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontColor, setFontColor] = useState("#333");
  const [fontSize, setFontSize] = useState(30);
  const [textObject, setTextObject] = useState(null);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  //const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const canvasRef = useRef(null);

  const userId = sessionStorage.getItem("userId");

  const [catId, setCatId] = useState("");
  const [subCatId, setSubCatId] = useState("");
  const [subCatList, setSubCatList] = useState([]);
  const [catList, setCatList] = useState([]);
  const [fontFamilyList, setFontFamilyList] = useState([]);
  const [fontWeightList, setFontWeightList] = useState([]);
  const [fontColorList, setFontColorList] = useState([]);
  const [selectedTextObject, setSelectedTextObject] = useState(null);
  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${BASEURL}/getCategory`);
      setCatList(response.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const fetchSubCategory = async (id) => {
    //console.log("inside subcat",catId)
    try {
      const response = await axios.post(`${BASEURL}/getSubCategory`, {
        catId: id,
      });
      console.log(response);
      setSubCatList(response.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const fetchFontColor = async () => {
    try {
      const response = await axios.get(`${BASEURL}/getFontColor`);
      setFontColorList(response.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };
  const fetchFontFamily = async () => {
    try {
      const response = await axios.get(`${BASEURL}/getFontFamily`);
      setFontFamilyList(response.data);
    } catch (error) {
      console.error("Error fetching font family:", error);
    }
  };
  const fetchFontWeight = async () => {
    try {
      const response = await axios.get(`${BASEURL}/getFontWeight`);
      setFontWeightList(response.data);
    } catch (error) {
      console.error("Error fetching font weight:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchFontFamily();
    fetchFontWeight();
    fetchFontColor();
  }, []);

  useEffect(() => {
    const initializedCanvas = new fabric.Canvas(canvasRef.current, {
      width: 430,
      height: 600,
    });
    setCanvas(initializedCanvas);

    const text = new fabric.IText("Drag this text", {
      left: 100,
      top: 100,
      fontFamily,
      fontWeight,
      fontSize,
      fill: fontColor,
      selectable: true,
    });
    initializedCanvas.add(text);
    setSelectedTextObject(text);
    // setTextObject(text);
    initializedCanvas.on("text:editing:entered", (e) => {
      setSelectedTextObject(e.target);
    });

    return () => initializedCanvas.dispose();
  }, []);

  useEffect(() => {
    if (selectedImage && canvas) {
      fabric.Image.fromURL(
        `${BASEURL}/uploads/${selectedImage}`,
        (img) => {
          const imgScale = Math.min(
            canvas.width / img.width,
            canvas.height / img.height
          );
          img.set({
            scaleX: imgScale,
            scaleY: imgScale,
            left: 0,
            top: 0,
            selectable: false,
            evented: false,
          });
          canvas.clear().add(img).add(selectedTextObject);
          canvas.renderAll();
        },
        {
          crossOrigin: "anonymous",
        }
      );
      console.log("canvas",canvas);
    }
  }, [selectedImage, canvas]);

  useEffect(() => {
    if (canvas && selectedTextObject) {
      selectedTextObject.set({
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        fontSize: fontSize,
        fill: fontColor,
      });
      canvas.renderAll();
    }
  }, [canvas, selectedTextObject, fontFamily, fontWeight, fontSize, fontColor]);

 
  const handleDownload = () => {
    if (canvas) {

      // Deselect all objects
      canvas.discardActiveObject();
      canvas.renderAll();
      console.log(canvas)

      // Get the image data URL
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1.0,
      });

      // Trigger the download
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "poster-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }
  };
  

  // testing
//   const handleDownload = () => {
//     if (canvas) {

//       // Deselect all objects
//       canvas.discardActiveObject();
//       canvas.renderAll();
      
//       var img = new Image();
// img.src = canvas.toDataURL();
// var link = document.createElement('a');
// var img2 = resizeImage(img, 800, 1200);
// link.href = img2.src;
// link.download = 'study-chart.png';
// link.click();

    

//     }
//   };

//   function resizeImage(img, w, h) {
//     var result = new Image();
//     //var canvas = document.createElement('canvas');
//     canvas.width = w;
//     canvas.height = h;
//     canvas.getContext('2d').drawImage(img, 0, 0, w, h);
//     result.src = canvas.toDataURL();
//     return result;
//   }
  

  
  const handleLanguageChange = async (e) => {
    setLanguage(e.target.value);
    if (e.target.value == "hi") {
      const translatedText = await translateText(
        selectedTextObject.text,
        "en",
        e.target.value
      );
      selectedTextObject.set("text", translatedText);
    } else {
      console.log(name);
      selectedTextObject.set("text", selectedTextObject.text);
    }
    canvas.renderAll();
  };

  async function translateText(text, from, to) {
    const options = {
      method: "POST",
      url: "https://rapid-translate-multi-traduction.p.rapidapi.com/t",
      headers: {
        "content-type": "application/json; charset=utf-8",
        "X-RapidAPI-Key": "7f0907abe3mshbffd796f0d1e962p13edb0jsn184e1efe60fb",
        //"X-RapidAPI-Key": "8492112e92msh92e835f0c40d894p18827fjsn575ba42c412b",
        //'X-RapidAPI-Key': 'e9ba6be376msh6459eaf88a66f67p1ee386jsnb992589e2f0c',
        "X-RapidAPI-Host": "rapid-translate-multi-traduction.p.rapidapi.com",
      },
      data: {
        from: from,
        to: to,
        q: text,
      },
    };

    try {
      const response = await axios.request(options);
      console.log("insie tra", response.data);
      //logger.error("sucsess"+response.data[0])
      return response.data[0];
    } catch (error) {
      console.error(error);
      return text; // Return original text in case of error
    }
  }

  const fetchImages = async () => {
    if (!subCatId) {
      return;
    }
    try {
      const response = await axios.post(`${BASEURL}/getImages`, { subCatId });
      //setImages(response.data);
      if (response.status == 200) {
        //setSelectedImage(response.data[0].image_name)
        setImageList(response.data);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [subCatId]);

  // const addTextBox = () => {
  //   if (canvas) {
  //     const newText = new fabric.IText('New Text', {
  //       left: 50,
  //       top: 50,
  //       fontFamily,
  //       fontWeight,
  //       fontSize,
  //       fill: fontColor,
  //       selectable: true,
  //     });
  //     canvas.add(newText);
  //     setSelectedTextObject(newText);
  //     canvas.setActiveObject(newText);
  //     canvas.renderAll();
  //   }
  // };

  const addTextBox = () => {
    if (canvas) {
      const newText = new fabric.IText("New Text", {
        left: 50,
        top: 50,
        fontFamily,
        fontWeight,
        fontSize,
        fill: fontColor,
        selectable: true,
      });
      setLanguage("");
      canvas.add(newText);
      canvas.renderAll();
    }
  };

  return (
    <>
      <main id="main" className="main">
        <div>
          <div className="row">
            <div className="d-sm-flex align-items-center justify-content-end mb-4">
              <select
                className="form-control"
                onChange={(e) => {
                  setCatId(e.target.value);
                  setSubCatId("");
                  fetchSubCategory(e.target.value);
                }}
                value={catId}
              >
                <option value="">Select Category</option>
                {catList.map((cat) => (
                  <option key={cat.cat_id} value={cat.cat_id}>
                    {cat.cat_name}
                  </option>
                ))}
              </select>

              <select
                className="form-control m-2"
                onChange={(e) => {
                  setSubCatId(e.target.value);
                }}
                value={subCatId}
              >
                <option value="">Select SubCategory</option>
                {subCatList &&
                  subCatList.length > 0 &&
                  subCatList.map((cat) => (
                    <option key={cat.subcat_id} value={cat.subcat_id}>
                      {cat.subcat_name}
                    </option>
                  ))}
              </select>

              <select
                className="form-control m-2"
                onChange={(e) => {
                  setSelectedImage(e.target.value);
                }}
                value={selectedImage}
              >
                <option value="">Select Image</option>
                {imageList &&
                  imageList.length > 0 &&
                  imageList.map((img) => (
                    <option key={img.imid} value={img.image_name}>
                      {img.image_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {/* <input
        type="text"
        placeholder="Change text..."
        onChange={(e) => {
          if (selectedTextObject) {
            selectedTextObject.set('text', e.target.value);
            setName(e.target.value);
            canvas.renderAll();
          }
        }}
      /> */}

          <div className="row">
            <div className="d-sm-flex align-items-center justify-content-end mb-4">
              <select
                value={fontFamily}
                className="form-control"
                onChange={(e) => setFontFamily(e.target.value)}
              >
                {fontFamilyList &&
                  fontFamilyList.length > 0 &&
                  fontFamilyList.map((e) => {
                    return (
                      <option key={e.id} value={e.value}>
                        {e.name}
                      </option>
                    );
                  })}
              </select>
              <select
                value={fontWeight}
                className="form-control"
                onChange={(e) => setFontWeight(e.target.value)}
              >
                {fontWeightList &&
                  fontWeightList.length > 0 &&
                  fontWeightList.map((e) => (
                    <option key={e.id} value={e.value}>
                      {e.name}
                    </option>
                  ))}
              </select>
              <select
                className="form-control"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
              >
                {fontColorList &&
                  fontColorList.length > 0 &&
                  fontColorList.map((e) => (
                    <option key={e.id} value={e.code}>
                      {e.name}
                    </option>
                  ))}
              </select>
              <input
                className="form-control"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                min="10"
                max="100"
              />
              <select
                className="form-control"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="">select Language</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
          <canvas ref={canvasRef} />
          {/* <button onClick={handleDownload}>Download Image</button>
          <button onClick={addTextBox}>Add Text</button> */}
                  <div className="">
                    <button
                      onClick={addTextBox}
                      className="btn btn-sm btn-primary m-1"
                    >
                      Add Text
                    </button>
                    <button
                      onClick={handleDownload}
                      className="btn btn-sm btn-primary m-1"
                    >
                      <i className="fas fa-download"></i> Image
                    </button>
                    
                  </div>
          
        </div>
      </main>
    </>
  );
};

export default ImageSection;
