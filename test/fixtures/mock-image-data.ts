export const mockImageData = ({
  numberOfImages = 10,
}: {
  numberOfImages: number;
}): Express.Multer.File[] => {
  const images = new Array(numberOfImages).fill(null).map((_, index) => {
    const imageNumber = index + 1;

    return {
      fieldname: "file",
      originalname: `test-image${imageNumber}.jpg`,
      encoding: "7bit",
      mimetype: "image/jpeg",
      buffer: Buffer.from("image data"),
      size: 1234,
      stream: {} as any, // Mocking the stream
      destination: "/uploads",
      filename: `test-image${imageNumber}.jpg`,
      path: `/uploads/test-image${imageNumber}.jpg`,
    };
  });

  return images;
};
