import { Prisma, UserRole } from "@prisma/client";

export type NavItems = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: NavItems[];
  hiddenFor?: UserRole[];
  indicatorHandler?: () => Promise<number>;
};
