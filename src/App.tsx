import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatData, ChatService } from "./services/chatService";
import {
  ChatPreviewListItem,
  getChatPreviewListItemProps,
} from "./components/app/ChatPreviewListItem";
import { useState } from "react";
import { exhaustiveGuard } from "./lib/utils";
import { Button } from "./components/ui/button";
import { ArchiveIcon, ArchiveRestoreIcon, Loader2Icon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";

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
      return selectedChat.members.map((m) => m.firstname).join(", ");
    default:
      return exhaustiveGuard(selectedChat.type);
  }
};

const App = () => {
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: allChats,
    error,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: () => ChatService.getChats(),
  });

  const archiveMutation = useMutation({
    mutationFn: (chatId: string) => ChatService.archiveChat(chatId),
    onMutate: async (chatId: string) => {
      
    },
    onSuccess: (chatId) => {
      const previousChatListState = queryClient.getQueryData<ChatData[]>([
        "chats",
      ]);
      const newChatListState = previousChatListState?.map((c) => ({
        ...c,
        isArchived: c.chatId === chatId ? true : c.isArchived,
      }));
      queryClient.setQueryData<ChatData[]>(["chats"], newChatListState ?? []);
    },
    onError: () => {},
    onSettled: () => {},
  });

  const unarchiveMutation = useMutation({
    mutationFn: (chatId: string) => ChatService.unarchiveChat(chatId),
    onMutate: async (chatId: string) => {
      
    },
    onSuccess: (chatId) => {
      const previousChatListState = queryClient.getQueryData<ChatData[]>([
        "chats",
      ]);
      const newChatListState = previousChatListState?.map((c) => ({
        ...c,
        isArchived: c.chatId === chatId ? false : c.isArchived,
      }));
      queryClient.setQueryData<ChatData[]>(["chats"], newChatListState ?? []);
    },
    onError: () => {},
    onSettled: () => {},
  });

  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);
  const [view, setView] = useState<"inbox" | "archived">("inbox");

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
        <div className="h-12 flex p-1">
          <Tabs
            className="w-full"
            value={view}
            onValueChange={(v) => {
              setSelectedChat(null);
              if (v === "inbox") {
                setView("inbox");
              }
              if (v === "archived") {
                setView("archived");
              }
            }}
          >
            <TabsList className="w-full">
              <TabsTrigger value="inbox" className="w-1/2">
                Inbox
              </TabsTrigger>
              <TabsTrigger value="archived" className="w-1/2">
                Archived
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grow overflow-auto">
          {allChats
            ?.filter((c) => (view === "inbox" ? !c.isArchived : c.isArchived))
            .map((chat) => {
              const otherProps = getChatPreviewListItemProps(
                chat,
                () => setSelectedChat(chat),
                selectedChat?.chatId === chat.chatId
              );
              return <ChatPreviewListItem key={chat.chatId} {...otherProps}/>;
            })}
        </div>
      </nav>
      <main className="h-full grow">
        <div className="h-12 flex items-center justify-center border-b-2 relative">
          <h1>{getSelectedChatTitle(selectedChat)}</h1>
          {selectedChat?.isArchived === false && (
            <Button
              className="absolute right-2"
              variant="ghost"
              size="icon"
              onClick={() => archiveMutation.mutate(selectedChat.chatId)}
            >
              {archiveMutation.isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <ArchiveIcon />
              )}
            </Button>
          )}
          {selectedChat?.isArchived === true && (
            <Button
              className="absolute right-2"
              variant="ghost"
              size="icon"
              onClick={() => unarchiveMutation.mutate(selectedChat.chatId)}
            >
              {unarchiveMutation.isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <ArchiveRestoreIcon />
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
