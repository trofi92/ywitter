export interface YweetType {
 id: string;
 text?: string;
 createdAt?: number;
 creatorId?: string;
 attachmentUrl?: string;
}
export interface YweetProps {
 yweetObj: YweetType;
 isOwner: boolean;
}
