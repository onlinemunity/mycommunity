
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface CommentFormProps {
  content: string;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  content,
  onContentChange,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Write your reply here..."
            rows={3}
            required
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? 'Submitting...' : isEditing ? 'Update Comment' : 'Post Comment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
