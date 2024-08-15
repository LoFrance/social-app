import {v4 as uuidv4} from 'uuid';



export const firstLetterUpperCase = (str: string): string => {
  if(!str.length) throw new Error('Please give a valid string!');
  const s = str.toLocaleLowerCase();
  return s ? s[0].toUpperCase() + s.slice(1) : ""
}

export const generateRandomUUIDs = () => {
  const myuuid = uuidv4();
  return myuuid;
}