export interface roomCard{
  id: number;
  name: string;
  pricePerNight: number;
  roomTypeId: number;
  maximumGuests: number;
  available: boolean;
  images: {
    id: number;
    source: string;
  }[];
}

export interface RoomFilter {
  roomTypeId: number;
  priceFrom: number;
  priceTo: number;
  maximumGuests: number;
  checkIn?: string;
  checkOut?: string;
}