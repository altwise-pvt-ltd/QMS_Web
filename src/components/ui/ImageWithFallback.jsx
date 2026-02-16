import React, { useState } from "react";
import defaultImage from "../../assets/defualt_image_placeholder.jpg";

const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src || defaultImage);

  const handleError = () => {
    if (imgSrc !== defaultImage) {
      setImgSrc(defaultImage);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
