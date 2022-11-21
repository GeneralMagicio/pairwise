export type Preference = {
  alpha: string
  beta: string
  preference: -1 | 0 | 1
}

export type Vote = {
  voter: string
  budgetBox: string
  preferences: Array<Preference>
}
