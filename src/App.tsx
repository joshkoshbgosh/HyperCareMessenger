import { useQuery } from "@tanstack/react-query";
import { ChatData, ChatService } from "./services/chatService";
import {
  ChatPreviewListItem,
  getChatPreviewListItemProps,
} from "./components/app/ChatPreviewListItem";
import { useState } from "react";
import { exhaustiveGuard } from "./lib/utils";

const getSelectedChatTitle = (selectedChat: ChatData | null): string => {
  if (!selectedChat) {
    return "Select a chat";
  }

  if (selectedChat.title) {
    return selectedChat.title;
  }

  switch (selectedChat.type) {
    case "self":
      return "Me";
    case "single":
      return selectedChat.members[0]!.firstname;
    case "group":
      return selectedChat.members.map(m => m.firstname).join(", ");
    default:
      return exhaustiveGuard(selectedChat.type);
  }
};

const App = () => {
  const { isLoading, isError, data: allChats, error } = useQuery({
    queryKey: ["chats"],
    queryFn: () => ChatService.getChats(),
  });

  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);

  // TODO: Handle loading and error states
  if (isLoading) {
  }

  if (isError) {
  }

  return (
    <div className="h-full flex">
      <nav className="w-96 h-full border-r-2 flex flex-col grow-0">
        <div className="h-12 flex items-center pl-2 border-b-2 shrink-0">
          <h1>Messaging</h1>
        </div>
        <div className="grow overflow-auto">
          {allChats?.map((chat) => {
            const otherProps = getChatPreviewListItemProps(
              chat,
              () => setSelectedChat(chat),
              selectedChat?.chatId === chat.chatId
            );
            return <ChatPreviewListItem key={chat.chatId} {...otherProps} />;
          })}
        </div>
      </nav>
      <main className="h-full grow">
        <div className="h-12 flex items-center justify-center border-b-2 relative">
          <h1>{getSelectedChatTitle(selectedChat)}</h1>
        </div>
      </main>
    </div>
  );
};

export default App;
