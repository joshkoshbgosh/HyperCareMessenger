import { cn } from "@/lib/utils";
import { ReactNode } from "react";

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
      className={cn("flex p-2 pl-5 transition duration-300 cursor-pointer", props.isPriority ? {
        "bg-yellow-300 hover:bg-yellow-500": true,
        "bg-yellow-400": props.isSelected,
      } : {
        "hover:bg-gray-300": true,
        "bg-gray-200": props.isSelected,
      })}
    >
      {props.avatar}
      <div className="grow flex flex-wrap px-2">
        <div className="grow">
          <div className="flex">
            <div className="grow font-bold">{props.title}</div>
            <div className="text-sm text-gray-500">{props.timeText}</div>
          </div>
          <div className="text-sm text-gray-500 line-clamp-1">
            {props.subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ChatPreviewListItem };
