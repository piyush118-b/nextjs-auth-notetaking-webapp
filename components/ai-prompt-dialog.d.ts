import React from 'react';

declare module './ai-prompt-dialog' {
  interface AIPromptDialogProps {
    onGenerate: (text: string) => void;
  }
  
  export const AIPromptDialog: React.FC<AIPromptDialogProps>;
  export default AIPromptDialog;
}
