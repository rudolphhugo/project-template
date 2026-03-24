export type Item = {
  id: string
  name: string
  icon: string
  tagId: string
}

export type Message = {
  id: string
  from: 'finder' | 'owner' | 'system'
  text: string
  time: number
}

export type RewardChoice = {
  type: 'code' | 'charity'
  charity?: string
}

export type TagState = {
  found: boolean
  locationShared: { lat: number; lng: number } | null
  messages: Message[]
  reward: { amount: number; currency: string } | null
  rewardChoice: RewardChoice | null
}
