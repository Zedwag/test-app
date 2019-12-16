export interface Post {
  userId: number,
  id: number,
  title: string,
  body: string,

  name?: string,
  username?: string,
  city?: string,
  commentsAmount?: number
  comments?: Comment[]

  outputOrder?: number

  visible?: boolean
}

export interface Comment {
  name: string,
  email: string,
  body: string
}

export interface UserInfo {
  name: string,
  username: string,
  address: {
    city: string
  }
}