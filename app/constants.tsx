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
import { HiMiniSquare3Stack3D } from "react-icons/hi2";

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
    title: "My tasks",
    icon: <ListTodo />,
    path: "tasks",
  },
  {
    title: "Projects",
    icon: <FolderKanban />,
    path: "projects",
  },
  {
    title: "Chat GPT",
    icon: <Brain />,
    path: "chat",
  },
  {
    title: "3D Models",
    icon: <HiMiniSquare3Stack3D/>,
    path: "models"
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
  "Windows Destroyer",
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
    status: "ISSUED",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "6",
    name: "Frontend development",
    description: "Implement the frontend",
    performers: ["Jane Smith"],
    status: "PROCESSING",
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
    name: "ISSUED",
    description: "Ещё не начато",
    colors: ["bg-green-300", "border-green-800"],
  },
  {
    name: "PROCESSING",
    description: "Активно идёт работа.",
    colors: ["bg-yellow-300", "border-yellow-800"],
  },
  {
    name: "REVIEW",
    description: "Проверяется, форматируется.",
    colors: ["bg-red-300", "border-red-800"],
  },
  {
    name: "DONE",
    description: "Полностью выполнено",
    colors: ["bg-purple-300", "border-purple-800"],
  },
] as const;
