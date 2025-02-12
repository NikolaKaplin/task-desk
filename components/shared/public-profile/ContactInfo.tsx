import { IoPhonePortraitOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";
export interface User {
  avatar: string;
  firstName: string;
  lastName: string;
  middleName: string;
  devStatus: string;
  description: string;
  contacts: {
    phone: string;
    email: string;
    github: string;
    gitlab: string;
    telegram: string;
  };
}

export default function ContactInfo({
  contacts,
}: {
  contacts: User["contacts"];
}) {
  return (
    <div className="p-6">
      <ul className="space-y-4">
        <li className="flex items-center">
          <span className="text-blue-400 mr-3">
            <IoPhonePortraitOutline />
          </span>
          <span className="text-gray-300">{contacts.phone}</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-400 mr-3">
            <MdEmail />
          </span>
          <a
            href={`mailto:${contacts.email}`}
            className="text-blue-400 hover:underline"
          >
            {contacts.email}
          </a>
        </li>
        <li className="flex items-center">
          <span className="text-blue-400 mr-3">
            <FaGithub />
          </span>
          <a href={contacts.github} className="text-blue-400 hover:underline">
            {contacts.github}
          </a>
        </li>
        <li className="flex items-center">
          <span className="text-blue-400 mr-3">
            <BsTelegram />
          </span>
          <a href={contacts.telegram} className="text-blue-400 hover:underline">
            {contacts.telegram}
          </a>
        </li>
      </ul>
    </div>
  );
}
