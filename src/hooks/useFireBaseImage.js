import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";

export default function useFirebaseImage(
    setValue,
    getValues,
    image_name = null,
    cb
) {
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState("");
    if (!setValue || !getValues) {
        return;
    }
    const handleUploadImage = (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progressPercent =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progressPercent);
                // snapshot.state: trạng thái hình ảnh
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        console.log("Nothing at all");
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors

                console.log(error);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImage(downloadURL);
                });
            }
        );
    };

    const handleSelectImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue("image_name", file.name);
        handleUploadImage(file);
    };

    const handleDeleteImage = () => {
        const storage = getStorage();

        // Create a reference to the file to delete
        const imageRef = ref(
            storage,
            "images/" + image_name || getValues("image_name")
        );

        // Delete the file
        deleteObject(imageRef)
            .then(() => {
                setImage("");
                console.log("Remove image successfully");
                setProgress(0);
                cb && cb();
            })
            .catch((error) => {
                console.log("handleDeleteImage ~ error", error);
                console.log("Can not delete image");
                setImage("");
            });
    };

    const handleResetUpload = () => {
        setImage("");
        setProgress(0);
    };

    return {
        image,
        setImage,
        progress,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    };
}
