import * as faMessages from './fa.json';

type MessagesType = typeof faMessages;

export function getMessage(
  type: keyof MessagesType, 
  code: string, 
  language: string = 'fa'
) {
  const allMessages: Record<string, MessagesType> = {
    fa: faMessages,
  };

  const messages = allMessages[language] || faMessages;
  const category = messages[type] as Record<string, string>;
  return category?.[code] || "پیام نامعتبر";
}
