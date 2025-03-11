import { StringChunk } from "drizzle-orm";

export type NavItems = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: NavItems[];
  hiddenFor?: string[];
  indicatorHandler?: () => Promise<number>;
};
export type TutorItems = {
  title: string;
  description: string;
  image: string;
  isLastSlide?: boolean;
};
