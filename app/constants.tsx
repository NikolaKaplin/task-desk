import {
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
    title: "Applications",
    icon: <ShieldCheck />,
    path: "applications",
    hiddenFor: ["UNVERIFIED", "USER"],
    indicatorHandler: countUnverifiedUsers,
  },
];
