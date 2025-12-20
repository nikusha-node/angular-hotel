export interface roomCard{
  id: number;
  name: string;
  pricePerNight: number;
  images: {
    id: number;
    source: string;
  }[];
}