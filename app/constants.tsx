import {
  Brain,
  FolderKanban,
  House,
  Icon,
  ListTodo,
  ShieldCheck,
  UserRoundCog,
  UsersRound,
} from "lucide-react";
import { NavItems } from "./types";
import { count } from "console";
import { countUnverifiedUsers } from "./actions";
import { Task } from "./(dashboard)/projects/[tasks]/page";

export const navItems: NavItems[] = [
  {
    title: "Home",
    icon: <House />,
    path: "home",
  },
  {
    title: "Profile",
    icon: <UserRoundCog />,
    path: "profile",
  },
  {
    title: "Team",
    icon: <UsersRound />,
    path: "team",
  },
  {
    title: "Tasks",
    icon: <ListTodo />,
    path: "tasks",
  },
  {
    title: "Projects",
    icon: <FolderKanban />,
    path: "projects",
  },
  {
    title: "AI Tools",
    icon: <Brain />,
    path: "ai-tools",
  },
  {
    title: "Applications",
    icon: <ShieldCheck />,
    path: "applications",
    hiddenFor: ["UNVERIFIED", "USER"],
    indicatorHandler: countUnverifiedUsers,
  },
];


export const softwareDevelopers = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "Game Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Data Engineer",
  "Machine Learning Engineer",
  "Quality Assurance Engineer",
  "UI/UX Designer",
  "Systems Analyst",
  "Embedded Systems Developer",
  "Cloud Engineer",
  "Blockchain Developer",
  "Security Engineer",
  "Game Designer",
  "Database Administrator",
  "Windows Destroyer"
];



export const initialTasks: Task[] = [
  {
    id: "1",
    name: "Design mockups",
    description: "Create initial design mockups",
    performers: ["John Doe"],
    status: "ISSUE",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "2",
    name: "Frontend development",
    description: "Implement the frontend",
    performers: ["Jane Smith"],
    status: "IN PROGRESS",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "3",
    name: "Backend API",
    description: "Develop the backend API",
    performers: ["Bob Johnson"],
    status: "REVIEW",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "4",
    name: "Testing",
    description: "Perform QA testing",
    performers: ["Alice Williams"],
    status: "COMPLETED",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "5",
    name: "Design mockups",
    description: "Create initial design mockups",
    performers: ["John Doe"],
    status: "ISSUE",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "6",
    name: "Frontend development",
    description: "Implement the frontend",
    performers: ["Jane Smith"],
    status: "IN PROGRESS",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "7",
    name: "Backend API",
    description: "Develop the backend API",
    performers: ["Bob Johnson"],
    status: "REVIEW",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "8",
    name: "Testing",
    description: "Perform QA testing",
    performers: ["Alice Williams"],
    status: "COMPLETED",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
];

export const listIds = [
  {
    name: "ISSUE",
    description: "Ещё не начато",
    colors: ['bg-green-300', 'border-green-800' ]
  },
  {
    name: "IN PROGRESS",
    description: "Активно идёт работа. Перед перемещением в эту колонку необходимо назначить исполнителей",
    colors: ['bg-yellow-300', 'border-yellow-800' ]
  },
  {
    name: "REVIEW",
    description: "Проверяется, форматируется и стилизуется. Не пройдя эту колонку таск не может попасть в Done",
    colors: ['bg-red-300', 'border-red-800' ]
  },
  {
    name: "DONE",
    description: "Полностью выполнено",
    colors: ['bg-purple-300', 'border-purple-800' ]
  }
] as const;
