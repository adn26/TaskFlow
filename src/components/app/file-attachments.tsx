import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { FileText, Upload } from "lucide-react";
import type { Attachment } from "@/lib/types";

type FileAttachmentsProps = {
  taskId: string;
};

const mockAttachments: Attachment[] = [
    { id: 'att-1', fileName: 'Homepage Mockup.png', fileType: 'image', url: PlaceHolderImages.find(i => i.id === 'task-attachment-1')?.imageUrl!, size: '1.2 MB' },
    { id: 'att-2', fileName: 'User Flow.pdf', fileType: 'pdf', url: '#', size: '800 KB' },
    { id: 'att-3', fileName: 'Mobile View.png', fileType: 'image', url: PlaceHolderImages.find(i => i.id === 'task-attachment-2')?.imageUrl!, size: '950 KB' },
];

export default function FileAttachments({ taskId }: FileAttachmentsProps) {
  // Filter attachments for the current task - in a real app, this would be an API call
  const attachments = mockAttachments;

  return (
    <div className="space-y-4">
      <div>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attachments.map(att => (
            <Card key={att.id}>
                <CardContent className="p-4 flex items-start gap-4">
                    {att.fileType === 'image' && att.url.startsWith('http') ? (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                           <Image src={att.url} alt={att.fileName} layout="fill" objectFit="cover" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                            <FileText className="w-8 h-8 text-muted-foreground"/>
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="font-medium truncate">{att.fileName}</p>
                        <p className="text-sm text-muted-foreground">{att.size}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1">Download</Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
