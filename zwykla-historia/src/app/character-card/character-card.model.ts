export interface CharacterData {
    name: string,
    money : number,
    history: {
      value: number,
      type: boolean, 
      note?: string,
      tax?: number
    }[]
  }
  
  export interface FormValue {
    goldValue: number,
    note: string,
    pennyValue: number,
    silverValue: number
  }