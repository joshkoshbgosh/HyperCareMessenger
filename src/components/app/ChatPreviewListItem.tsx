import { cn, exhaustiveGuard } from "@/lib/utils";
import { ChatData } from "@/services/chatService";
import { ReactNode } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Users } from "lucide-react";

const MAX_DEFAULT_TITLE_LENGTH = 25;
const MILLIS_IN_A_DAY = 1000 * 60 * 60 * 24;
const MILLIS_IN_A_WEEK = MILLIS_IN_A_DAY * 7;

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
      return exhaustiveGuard(chat.type);
  }
};

const getChatPreviewListItemCornerText = (chat: ChatData): string => {
  const lastMessageDate = new Date(chat.lastMessage.dateCreated);
  const now = new Date();

  const isLastMessageWithin24Hours =
    now.valueOf() - lastMessageDate.valueOf() < MILLIS_IN_A_DAY;
  const isLastMessageWithin7Days =
    now.valueOf() - lastMessageDate.valueOf() < MILLIS_IN_A_WEEK;

  if (isLastMessageWithin24Hours) {
    return lastMessageDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    });
  }

  if (isLastMessageWithin7Days) {
    return lastMessageDate.toLocaleDateString([], {
      weekday: "short",
    });
  }

  return lastMessageDate.toLocaleDateString([], {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
};

const getChatPreviewListItemProps = (
  chat: ChatData,
  onClick: () => void,
  isSelected: boolean
): ChatPreviewListItemProps => {
  return {
    title: chat.title ?? getChatPreviewListItemDefaultTitle(chat),
    subtitle: getChatPreviewListItemSubtitle(chat),
    cornerText: getChatPreviewListItemCornerText(chat),
    avatar: getChatPreviewListItemAvatar(chat),
    onClick,
    isSelected,
    isPriority: chat.lastMessage.priority,
  };
};

type ChatPreviewListItemProps = {
  avatar: ReactNode;
  title: string;
  subtitle: string;
  cornerText: string;
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
            <div className="text-xs text-gray-500">{props.cornerText}</div>
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
