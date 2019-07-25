
type BaseUserContent = {
    id: number
    name: string
    email: string
    avatar: string,
    checked: boolean,
}

export interface IUserContentResponse extends BaseUserContent {
  createdAt: string,
  updatedAt: string
}

export interface IUserContent extends BaseUserContent {
  createdAt: Date,
  updatedAt: Date
}
