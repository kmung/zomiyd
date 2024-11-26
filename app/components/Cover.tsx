interface CoverProps {
    title: string;
    backgroundImage: StaticImageData;
}

function Cover({ title, backgroundImage}: CoverProps) {
  return (
    <div className="h-[90vh] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
        <h1 className="text-4xl font-bold text-white">{title}</h1>
    </div>
  );
}

export default Cover;