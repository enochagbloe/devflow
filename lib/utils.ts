import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {techMap} from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviconClassName = (techName: string)=>{
  const normalizedTechName = techName.replace(/[ .]/g,  "").toLowerCase();

   

  return techMap[normalizedTechName]? `${techMap[normalizedTechName]} colored`: "devicon-devicon-plain";
}

export const getTimeStamp = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};
