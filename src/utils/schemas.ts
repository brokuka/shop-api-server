export interface Product {
  id: number
  title: string
  price: number
  image: string
  description: string
  category: string
  rating: {
    rate: number
    count: number
  }
}
