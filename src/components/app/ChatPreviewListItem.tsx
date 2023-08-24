import { cn, exhaustiveGuard } from "@/lib/utils";
import { ChatData } from "@/services/chatService";
import { ReactNode } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Users } from "lucide-react";

const MAX_DEFAULT_TITLE_LENGTH = 25;

const getChatPreviewListItemDefaultTitle = (chat: ChatData): string => {
  const abbreviatedDefaultTitle = `${chat.members[0]?.firstname} + ${
    chat.members.length - 1
  } other people`;
  const defaultTitle = chat.members.map((m) => m.firstname).join(", ");

  return defaultTitle.length > MAX_DEFAULT_TITLE_LENGTH
    ? abbreviatedDefaultTitle
    : defaultTitle;
};

const getChatPreviewListItemSubtitle = (chat: ChatData): string => {
  return `${chat.lastMessage.sender.firstname}: ${chat.lastMessage.message}`;
};

const getChatPreviewListItemAvatar = (chat: ChatData): ReactNode => {
  switch (chat.type) {
    case "self":
      return (
        <Avatar>
          <AvatarFallback>{`${chat.members[0]?.firstname[0]}${chat.members[0]?.lastname[0]}`}</AvatarFallback>
        </Avatar>
      );
    case "single":
      return (
        <Avatar>
          <AvatarImage
            src={chat.members[0]?.profilePic ?? ""}
            alt={chat.members[0]?.firstname}
          />
          <AvatarFallback>{`${chat.members[0]?.firstname[0]}${chat.members[0]?.lastname[0]}`}</AvatarFallback>
        </Avatar>
      );
    case "group":
      return (
        <Avatar>
          <AvatarFallback>
            <Users />
          </AvatarFallback>
        </Avatar>
      );
    default:
      return exhaustiveGuard(chat.type)
  }
};

const getChatPreviewListItemProps = (
  chat: ChatData,
  onClick: () => void,
  isSelected: boolean
): ChatPreviewListItemProps => {
  return {
    title: chat.title ?? getChatPreviewListItemDefaultTitle(chat),
    subtitle: getChatPreviewListItemSubtitle(chat),
    timeText: "12:05 PM",
    avatar: getChatPreviewListItemAvatar(chat),
    onClick,
    isSelected,
    isPriority: false,
  };
};

type ChatPreviewListItemProps = {
  avatar: ReactNode;
  title: string;
  subtitle: string;
  timeText: string;
  onClick: () => void;
  isSelected: boolean;
  isPriority: boolean;
};

const ChatPreviewListItem = (props: ChatPreviewListItemProps) => {
  return (
    <div
      onClick={props.onClick}
      className={cn(
        "flex p-2 pl-5 transition duration-300 cursor-pointer",
        props.isPriority
          ? {
              "bg-yellow-300 hover:bg-yellow-500": true,
              "bg-yellow-400": props.isSelected,
            }
          : {
              "hover:bg-gray-300": true,
              "bg-gray-200": props.isSelected,
            }
      )}
    >
      {props.avatar}
      <div className="grow flex flex-wrap px-2">
        <div className="grow">
          <div className="flex">
            <div className="grow text-sm line-clamp-1">{props.title}</div>
            <div className="text-xs text-gray-500">{props.timeText}</div>
          </div>
          <div className="text-xs text-gray-500 line-clamp-1 break-all">
            {props.subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ChatPreviewListItem, getChatPreviewListItemProps };
