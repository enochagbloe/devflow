import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { techMap } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTechDescriptionMap = (key: string): string => {
  const techDescriptionMap: { [key: string]: string } = {
    javascript:
      "JavaScript is a powerful language for building dynamic, interactive and modern web applications",
    typescript:
      "TypeScript adds a strong typing for JavaScript, making it great for scalable an maintaining application",
    react:
      "React is a popular JavaScript library for building user interfaces with reusable components and efficient state management",
    nodejs:
      "Node.js enables server-side JavaScript development with excellent performance and a vast ecosystem of packages",
    python:
      "Python is a versatile, readable programming language perfect for web development, data science, and automation",
    mongodb:
      "MongoDB is a flexible NoSQL database that stores data in JSON-like documents, ideal for modern applications",
    postgresql:
      "PostgreSQL is a robust, feature-rich relational database known for its reliability and advanced SQL capabilities",
    docker:
      "Docker containerizes applications, ensuring consistent deployment across different environments and platforms",
    kubernetes:
      "Kubernetes orchestrates containerized applications at scale, providing automated deployment and management",
    aws: "Amazon Web Services offers comprehensive cloud computing services for hosting, storage, and application deployment",
    git: "Git is the industry-standard version control system for tracking code changes and collaborative development",
    webpack:
      "Webpack bundles and optimizes JavaScript modules and assets for efficient web application delivery",
    redux:
      "Redux provides predictable state management for JavaScript applications through a centralized store pattern",
    express:
      "Express.js is a minimal, fast web framework for Node.js that simplifies server-side application development",
    vue: "Vue.js is an approachable JavaScript framework for building interactive user interfaces and single-page applications",
    angular:
      "Angular is a comprehensive TypeScript framework for building large-scale, enterprise-level web applications",
    nextjs:
      "Next.js is a React framework that enables server-side rendering and static site generation for optimized performance",
    graphql:
      "GraphQL is a query language and runtime that provides efficient, flexible APIs with strong typing",
    redis:
      "Redis is an in-memory data store used for caching, session management, and real-time applications",
    nginx:
      "Nginx is a high-performance web server and reverse proxy known for handling concurrent connections efficiently",
    tailwind:
      "Tailwind CSS is a utility-first CSS framework that enables rapid UI development with pre-built classes",
    firebase:
      "Firebase provides backend-as-a-service with real-time databases, authentication, and hosting solutions",
    java: "Java is a robust, object-oriented programming language known for its platform independence and excellent performance in enterprise applications",
  };
  return techDescriptionMap[key];
};

export const getDeviconClassName = (techName: string) => {
  if (!techName || typeof techName !== "string") return "devicon-devicon-plain";
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
};

export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
};

export const formatNumber = (views: number): string => {
  if (views >= 1000000){
    return (views / 1000000).toFixed(1) + 'M';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  } else {
    return views.toString();
  }
};