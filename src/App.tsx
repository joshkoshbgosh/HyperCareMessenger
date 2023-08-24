import { useQuery } from "@tanstack/react-query";
import { ChatService } from "./services/chatService";
import {
  ChatPreviewListItem,
  getChatPreviewListItemProps,
} from "./components/app/ChatPreviewListItem";

const App = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["chats"],
    queryFn: () => ChatService.getChats(),
  });

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
          {data?.map((chat) => {
            const otherProps = getChatPreviewListItemProps(
              chat,
              () => {},
              false
            );
            return <ChatPreviewListItem key={chat.chatId} {...otherProps} />;
          })}
        </div>
      </nav>
      <main className="h-full grow">
        <div className="h-12 flex items-center justify-center border-b-2">
          <h1>Testing</h1>
        </div>
      </main>
    </div>
  );
};

export default App;
