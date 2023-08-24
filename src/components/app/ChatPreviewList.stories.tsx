import type { Meta, StoryObj } from "@storybook/react";
import { ChatPreviewListItem } from "./ChatPreviewListItem";
import { Avatar, AvatarFallback} from "@/components/ui/avatar";

const meta = {
  title: "Components/ChatPreviewListItem",
  component: ChatPreviewListItem,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ChatPreviewListItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    avatar: <Avatar><AvatarFallback>JA</AvatarFallback></Avatar>,
    title: "Title",
    subtitle: "This is the song that never ends, it just goes on and on my friends. Some people started singing it not knowing what it was, and they'll continue singing it forever just because.",
    cornerText: "12:05 PM",
    isSelected: false,
    isPriority: false,
  },
};

export const Selected: Story = {
  args: {
    avatar: <Avatar><AvatarFallback>JA</AvatarFallback></Avatar>,
    title: "Title",
    subtitle: "This is the song that never ends, it just goes on and on my friends. Some people started singing it not knowing what it was, and they'll continue singing it forever just because.",
    cornerText: "12:05 PM",
    isSelected: true,
    isPriority: false,
  },
};

export const Priority: Story = {
  args: {
    avatar: <Avatar><AvatarFallback>JA</AvatarFallback></Avatar>,
    title: "Title",
    subtitle: "This is the song that never ends, it just goes on and on my friends. Some people started singing it not knowing what it was, and they'll continue singing it forever just because.",
    cornerText: "12:05 PM",
    isSelected: false,
    isPriority: true,
  },
};
