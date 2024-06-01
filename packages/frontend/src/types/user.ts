export interface IUserInformation {
  id: string
  firstName: string
  lastName: string
  email: string
  image: string
  phoneNumber: string
  isVerified: boolean
  role: string
  created_at: string
  updated_at: string
  deleted_at: string
  _id: Buffer
}

export interface RoleFiltered {
  label: string
  value: string
}
