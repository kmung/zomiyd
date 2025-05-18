// TODO: fetch video data asynchronously from strapi
// TODO: set the video data to be dynamic, as a content model like homepage_video

interface VideoBoxProps {
    src: string;
}

const VideoBox = ({ src}: VideoBoxProps) => {
    return (
        <div className="flex flex-col md:flex-row items-center md:items-start bg-gray-900 rounded-lg shadow-lg">
            <div className="w-full">
                <iframe
                    src={src}
                    className="w-full h-64 md:h-96 rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};

export default VideoBox;