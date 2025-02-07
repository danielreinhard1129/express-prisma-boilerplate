import { Sample } from "@prisma/client";

export const mockSampleData = ({
  numberOfSamples = 10,
}: {
  numberOfSamples: number;
}): Sample[] => {
  const samples = new Array(numberOfSamples).fill(null).map((_, index) => {
    const sampleNumber = index + 1;

    return {
      id: sampleNumber,
      name: "Sample" + sampleNumber,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  return samples;
};
