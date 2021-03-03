import React, {useState} from 'react';
import ImageUploading from 'react-images-uploading';
import { v4 as uuidv4 } from 'uuid';

const Images = () => {

    const osName = window.require('os');

    const [images, setImages] = useState([]);
    const [urlImage, setUrlImage] = useState('');
    const [imageFileName, setImageFilename] = useState('');

    const onChange = (imageList) => {
        // data for submit

        if(imageList.length !== 0) {
            setImages(imageList);
            setUrlImage(imageList[0].data_url);
            setImageFilename(imageList[0].file.name);
        } else {
            setImages([]);
            setUrlImage('');
            setImageFilename('');
        }
    };

    const handleSave = () => {

        const imageFile = urlImage;
        const fs = window.require('fs');

        const data = imageFile.replace(/^data:image\/\w+;base64,/, "");
        const buf = new Buffer.from(data, 'base64');

        if (!fs.existsSync(`C:\\users\\${osName.userInfo().username}\\AppData\\Roaming\\testimages`)) fs.mkdir(`C:\\users\\${osName.userInfo().username}\\AppData\\Roaming\\testimages`, () => {

        });

        fs.writeFile(`C:\\users\\${osName.userInfo().username}\\AppData\\Roaming\\testimages\\${uuidv4()}.png`, buf,(err) => {
            if(err){
                alert("An error occurred creating the file "+ err.message)
            } else {
                alert("The file has been successfully saved!");
            }
        });

    }

    return (
        <div>
            <ImageUploading
                multiple={false}
                value={images}
                onChange={onChange}
                dataURLKey="data_url"
                acceptType={['jpg', 'gif', 'png']}
                maxFileSize={5242880}
            >
                {({
                      imageList,
                      onImageUpload,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                        <div className="row">
                            <div className="col text-center">
                                <p>Max file size: 5Mb</p>
                            </div>
                        </div>
                        <div className="row justify-content-center text-center">
                            <div className="col-6">
                                <div className="card bg-primary my-3">
                                    <div className={`card-body text-light ${isDragging ? 'bg-primary' : undefined}`} onClick={onImageUpload} {...dragProps}>
                                        Click or Drop here
                                    </div>
                                </div>
                            </div>
                        </div>

                        {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <p>Filename: <span className="fw-bold">{imageFileName}</span></p>
                                <img src={urlImage} alt="" className="img-thumbnail" />
                                <div className="image-item__btn-wrapper my-5 d-flex justify-content-around pt-3">
                                    <button className="btn btn-success" onClick={handleSave}>Save</button>
                                    <button className="btn btn-warning" onClick={() => onImageUpdate(index)}>Update</button>
                                    <button className="btn btn-danger" onClick={() => onImageRemove(index)}>Remove</button>
                                </div>
                                <div className="small pb-3">The image will be saved in: C:\Users\username\AppData\Roaming\testimages</div>
                            </div>
                        ))}

                    </div>
                )}
            </ImageUploading>
        </div>
    );
};

export default Images;