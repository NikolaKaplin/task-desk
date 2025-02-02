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
];

