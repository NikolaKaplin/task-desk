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

export default function ContactInfo({ contacts }: { contacts: User['contacts'] }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <h3 className="text-2xl font-semibold mb-6 text-green-400">Контакты</h3>
      <ul className="space-y-4">
        <li className="flex items-center">
          <span className="text-blue-400 mr-3">📞</span>
          <span className="text-gray-300">{contacts.phone}</span>
        </li>
        <li className="flex items-center">
          <span className="text-blue-400 mr-3">✉️</span>
          <a href={`mailto:${contacts.email}`} className="text-blue-400 hover:underline">
            {contacts.email}
          </a>
        </li>
        <li className="flex items-center">
          <span className="text-blue-400 mr-3">🐙</span>
          <a href={contacts.github} className="text-blue-400 hover:underline">
            {contacts.github}
          </a>
        </li>
        <li className="flex items-center">
          <span className="text-blue-400 mr-3">🦊</span>
          <a href={contacts.gitlab} className="text-blue-400 hover:underline">
            {contacts.gitlab}
          </a>
        </li>
        <li className="flex items-center">
          <span className="text-blue-400 mr-3">✈️</span>
          <a href={contacts.telegram} className="text-blue-400 hover:underline">
            {contacts.telegram}
          </a>
        </li>
      </ul>
    </div>
  )
}

