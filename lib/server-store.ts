import type { TagState, Item } from './keyturn-store'

const store = new Map<string, TagState>()

const itemStore = new Map<string, Item>([
  ['abc123', { id: 'abc123', name: 'Home Keys', icon: '🔑', tagId: 'abc123' }],
  ['work-badge', { id: 'work-badge', name: 'Work Badge', icon: '🪪', tagId: 'work-badge' }],
  ['backpack', { id: 'backpack', name: 'Backpack', icon: '🎒', tagId: 'backpack' }],
])

const defaultState = (): TagState => ({
  found: false,
  locationShared: null,
  messages: [],
  reward: null,
  rewardChoice: null,
})

export function getServerTagState(tagId: string): TagState {
  return store.get(tagId) ?? defaultState()
}

export function setServerTagState(tagId: string, state: TagState): void {
  store.set(tagId, state)
}

export function resetServerTagState(tagId: string): void {
  store.delete(tagId)
}

export function getAllItems(): Item[] {
  return Array.from(itemStore.values())
}

export function addItem(item: Item): void {
  itemStore.set(item.id, item)
}

export function removeItem(id: string): void {
  itemStore.delete(id)
}
