import type { TagState } from './keyturn-store'

const store = new Map<string, TagState>()

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
