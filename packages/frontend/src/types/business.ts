export interface IBusiness {
  name: string
  description: string
  phoneNumber: string
  website: string
  category: ICategory
  services: IService[]
  overallRating: number
  totalReview: number
  addressLine: string
  fullAddress: string
  province: string
  district: string
  country: string
  dayOfWeek: IDayOfWeek[]
  location: {
    coordinates: [number, number]
    type: string
  }
  userId?: Buffer
  images: IBusinessImage[]
  stars: IStar[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  id: string
  score: number
  _distance: number
}

export interface IStar {
  star: string
  count: number
}

export interface ICategory {
  name: string
  id: string
}

export interface IBusinessImage {
  url: string
  public_id: string
  etag: string
  phash: string
}

export interface IDayOfWeek {
  day: string
  openTime: string
  closeTime: string
  order: number
}

export interface IBusinessCategory {
  name: string
  id: Buffer
}

export interface IService {
  name: string
  id: string
  order: number
}
