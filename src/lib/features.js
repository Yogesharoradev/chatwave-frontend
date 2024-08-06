
const fileFormat = (url="") => {
            const fileExtension = url.split(".").pop()

            if(fileExtension === "mp4" || fileExtension === "webm" || fileExtension ==="ogg")
            return "video"
            if(fileExtension === "mp3" || fileExtension === "wav") return "audio"
            if(fileExtension === "png" || fileExtension === "jpg" || fileExtension ==="jpeg" || fileExtension === "gif")
            return "image"

             return "file"
}

const TransformImage = (url="" , width= 100) => url



const getorSaveFromStorage = ({ key, value, get }) => {
    if (get) {
        const item = localStorage.getItem(key);
        return item !== null && item !== undefined ? JSON.parse(item) : null;
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
};


export { TransformImage, fileFormat, getorSaveFromStorage };
