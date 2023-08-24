import { z } from "zod";

const ChatMemberSchema = z.object({
    id: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    username: z.string(),
    role: z.string().nullable(),
    profilePic: z.string().nullable(),
    status: z.enum(["active"]), // not sure of possible values
    privilege: z.enum(["ADMIN", "REGULAR"]), // not sure if this is exhaustive
    workStatus: z.enum(["on_shift"]), // not sure of possible values
    statusExpiryDate: z.string().nullable(),
    statusDescription: z.string().nullable(),
    workStatusProxy: z.any(), // not sure of possible values
});

const ChatMemberBasicSchema = ChatMemberSchema.pick({
    id: true,
    firstname: true,
    lastname: true,
    profilePic: true,
    role: true,
    statusDescription: true,
    username: true,
    workStatus: true,
    workStatusProxy: true,
});

const ChatMessageReadBySchema = z.object({
    messageId: z.number(),
    timestamp: z.string().datetime(),
    user: ChatMemberBasicSchema,
});

const ChatMessageSchema = z.object({
    id: z.number(),
    type: z.enum(["text"]), // not sure of possible values
    data: z.any(), // not sure of possible values
    image: z.string().nullable(), // this is an assumption
    priority: z.boolean(),
    readBy: z.array(ChatMessageReadBySchema),
    sender: ChatMemberBasicSchema,
    message: z.string(),
    dateCreated: z.string().datetime(),
});

const ChatSchema = z.object({
    chatId: z.string(),
    title: z.string().nullable(),
    type: z.enum(["self", "single", "group"]),
    members: z.array(ChatMemberSchema),
    muted: z.array(ChatMemberBasicSchema), // this is an assumption
    status: z.enum(["active"]), // not sure of possible values
    dateCreated: z.string(),
    isArchived: z.boolean(),
    lastMessage: ChatMessageSchema,
});

const ChatListSchema = z.array(ChatSchema);

export type ChatData = z.infer<typeof ChatSchema>;

class ChatService {
    static async getChats(isPriority: boolean = false, limit: number = 100): Promise<ChatData[]> {
        const request = new Request(import.meta.env.VITE_GQL_ENDPOINT, {
            method: 'POST',
            headers: {
              'hypercare-scope': import.meta.env.VITE_GQL_SCOPE,
              'content-type': 'application/json',
              'authorization': `Bearer ${import.meta.env.VITE_GQL_TOKEN}`,
            },
            body: JSON.stringify({
              "query": `query organizationChats($continuationId: ID, $limit: Int, $isPriority: Boolean) {\n chatsForOrganization(continuationId: $continuationId, limit: $limit, isPriority: $isPriority) {\n chats {\n...basicChatFields\n unreadPriorityMessages \n }\n }\n}\n\nfragment basicChatFields on Chat {\n chatId: id\ntitle\n type\n members {\n ...chatMemberFields\n }\n lastMessage {\n ...messageFields\n }\n muted\nstatus\n dateCreated\n isArchived\n unreadPriorityMessages\n}\n\nfragment chatMemberFields on ChatMember {\n id\n firstname\n lastname\n username\n role\n profilePic {\n url\n }\n status\n privilege\nworkStatus\n statusExpiryDate\n statusDescription\n workStatusProxy {\n ...publicUserStatusFields\n}\n}\n\nfragment messageFields on Message {\n id\n priority\n message\n image\n# attachment {\n# url\n#mimeType\n# fileName\n# }\n type\n dateCreated\n sender {\n ...publicUserFields\n }\n readBy {\n...readReceiptFields\n }\n data {\n __typename\n ... on ConsultMessageData {\n mrn\n firstname\nlastname\n details\n }\n }\n}\n\nfragment readReceiptFields on ReadReceipt {\n messageId\n user {\n...publicUserFields\n }\n timestamp\n}\n\nfragment publicUserFields on PublicUser {\n id\n firstname\nlastname\n username\n role\n profilePic {\n url\n }\n workStatus\n statusDescription\n workStatusProxy {\n...publicUserStatusFields\n }\n}\n\nfragment publicUserStatusFields on PublicUser {\n id\n firstname\nlastname\n username\n role\n profilePic {\n url\n }\n}\n\n`,
              "variables": {isPriority, limit}
            })
          });
        const response = await fetch(request);
        const data = await response.json();

        const chats = data?.data?.chatsForOrganization?.chats;

        if (!chats) {
            throw new Error("chats not found");
        }

        const chatListParseResult = ChatListSchema.safeParse(chats);

        if (!chatListParseResult.success) {
            throw new Error(chatListParseResult.error.message);
        }
        return chatListParseResult.data;
    }

    // TODO: implement this for real
    static async archiveChat(chatId: string): Promise<string> {
        return await new Promise((resolve) => setTimeout(() => resolve(chatId), 1000));
     }

    // TODO: implement this for real
    static async unarchiveChat(chatId: string): Promise<string> {
       return await new Promise((resolve) => setTimeout(() => resolve(chatId), 1000));
    }
}

export {ChatService};