import { removeItem } from "./asyncStorage";

export const startNewChatSession = async ({
  setActiveChatId,
  setMessages,
}) => {
  await removeItem("active_chat_id");

  if (setActiveChatId) {
    setActiveChatId(null);
  }

  if (setMessages) {
    setMessages([]);
  }
};