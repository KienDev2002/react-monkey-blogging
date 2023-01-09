import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ImageUpload = (props) => {
    const {
        name,
        className = "",
        progress = 0,
        image = "",
        handleDeleteImage = () => {},
        ...rest
    } = props;

    return (
        <label
            className={`cursor-pointer flex items-center justify-center group bg-gray-100 border border-dashed w-full min-h-[200px] rounded-lg ${className} relative overflow-hidden`}
        >
            <input
                type="file"
                name={name}
                className="hidden-input"
                onChange={() => {}}
                {...rest}
            />

            {!image && progress !== 0 && (
                <div className="absolute w-16 h-16 border-8 border-green-500 rounded-full border-t-transparent animate-spin"></div>
            )}

            {!image && progress === 0 && (
                <div className="flex flex-col items-center text-center pointer-events-none">
                    <img
                        src="/img-upload.png"
                        alt="upload-img"
                        className="max-w-[80px] mb-5"
                    />
                    <p className="font-semibold">Choose photo</p>
                </div>
            )}

            {image && (
                <Fragment>
                    <img
                        src={image}
                        alt="upload-img"
                        className="object-cover w-full h-full"
                    />
                </Fragment>
            )}

            {!image && (
                <div
                    className="absolute bottom-0 left-0 w-0 h-1 transition-all bg-green-400 image-upload-progress"
                    style={{ width: `${Math.ceil(progress)}%` }}
                ></div>
            )}
        </label>
    );
};

ImageUpload.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    progress: PropTypes.number,
    image: PropTypes.string,
};

export default ImageUpload;
