
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Course = {
  id: string;
  title: string;
};

type Lecture = {
  id: string;
  title: string;
  description: string | null;
  course_id: string;
  content: string | null;
  video_url: string | null;
  duration: string;
  sort_order: number;
};

type LectureFormData = Omit<Lecture, 'id'>;

const LecturesManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [formData, setFormData] = useState<LectureFormData>({
    title: '',
    description: '',
    course_id: '',
    content: '',
    video_url: '',
    duration: '10 minutes',
    sort_order: 0,
  });

  // Fetch courses for dropdown
  const { data: courses } = useQuery({
    queryKey: ['admin-courses-dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title');
      
      if (error) throw error;
      return data as Course[];
    },
  });

  // Fetch lectures
  const { data: lectures, isLoading } = useQuery({
    queryKey: ['admin-lectures'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lectures')
        .select('*, courses(title)')
        .order('course_id')
        .order('sort_order');
      
      if (error) throw error;
      return data as (Lecture & { courses: { title: string } })[];
    },
  });

  // Create lecture mutation
  const createLectureMutation = useMutation({
    mutationFn: async (newLecture: LectureFormData) => {
      const { data, error } = await supabase
        .from('lectures')
        .insert([newLecture])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lectures'] });
      toast({
        title: t('admin.lectureCreated'),
        description: t('admin.lectureCreatedDesc'),
      });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating lecture:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.errorCreatingLecture'),
        variant: 'destructive',
      });
    },
  });

  // Update lecture mutation
  const updateLectureMutation = useMutation({
    mutationFn: async (lecture: Lecture) => {
      const { id, ...lectureData } = lecture;
      const { data, error } = await supabase
        .from('lectures')
        .update(lectureData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lectures'] });
      toast({
        title: t('admin.lectureUpdated'),
        description: t('admin.lectureUpdatedDesc'),
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating lecture:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.errorUpdatingLecture'),
        variant: 'destructive',
      });
    },
  });

  // Delete lecture mutation
  const deleteLectureMutation = useMutation({
    mutationFn: async (lectureId: string) => {
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', lectureId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lectures'] });
      toast({
        title: t('admin.lectureDeleted'),
        description: t('admin.lectureDeletedDesc'),
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting lecture:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.errorDeletingLecture'),
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'sort_order' ? parseInt(value, 10) : value 
    }));
  };

  const handleCreateLecture = (e: React.FormEvent) => {
    e.preventDefault();
    createLectureMutation.mutate(formData);
  };

  const handleUpdateLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLecture) {
      updateLectureMutation.mutate({
        ...formData,
        id: selectedLecture.id,
      });
    }
  };

  const handleDeleteLecture = () => {
    if (selectedLecture) {
      deleteLectureMutation.mutate(selectedLecture.id);
    }
  };

  const handleEdit = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setFormData({
      title: lecture.title,
      description: lecture.description || '',
      course_id: lecture.course_id,
      content: lecture.content || '',
      video_url: lecture.video_url || '',
      duration: lecture.duration,
      sort_order: lecture.sort_order,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course_id: courses && courses.length > 0 ? courses[0].id : '',
      content: '',
      video_url: '',
      duration: '10 minutes',
      sort_order: 0,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('admin.lecturesManagement')}</h2>
          <Button onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> {t('admin.createLecture')}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-accent1" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.title')}</TableHead>
                <TableHead>{t('admin.course')}</TableHead>
                <TableHead>{t('admin.duration')}</TableHead>
                <TableHead>{t('admin.sortOrder')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lectures && lectures.length > 0 ? (
                lectures.map((lecture) => (
                  <TableRow key={lecture.id}>
                    <TableCell className="font-medium">{lecture.title}</TableCell>
                    <TableCell>{lecture.courses.title}</TableCell>
                    <TableCell>{lecture.duration}</TableCell>
                    <TableCell>{lecture.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(lecture)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(lecture)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t('admin.noLectures')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Create Lecture Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('admin.createLecture')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateLecture} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('admin.title')}</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course_id">{t('admin.course')}</Label>
                  <select
                    id="course_id"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">{t('admin.selectCourse')}</option>
                    {courses && courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">{t('admin.duration')}</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    value={formData.duration} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">{t('admin.sortOrder')}</Label>
                  <Input 
                    id="sort_order" 
                    name="sort_order" 
                    type="number"
                    value={formData.sort_order} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video_url">{t('admin.videoUrl')}</Label>
                  <Input 
                    id="video_url" 
                    name="video_url" 
                    value={formData.video_url || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('admin.description')}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description || ''} 
                  onChange={handleInputChange} 
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">{t('admin.content')}</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={formData.content || ''} 
                  onChange={handleInputChange} 
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t('admin.cancel')}
                </Button>
                <Button type="submit">
                  {t('admin.create')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Lecture Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('admin.editLecture')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateLecture} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">{t('admin.title')}</Label>
                  <Input 
                    id="edit-title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-course_id">{t('admin.course')}</Label>
                  <select
                    id="edit-course_id"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    {courses && courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">{t('admin.duration')}</Label>
                  <Input 
                    id="edit-duration" 
                    name="duration" 
                    value={formData.duration} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sort_order">{t('admin.sortOrder')}</Label>
                  <Input 
                    id="edit-sort_order" 
                    name="sort_order" 
                    type="number"
                    value={formData.sort_order} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-video_url">{t('admin.videoUrl')}</Label>
                  <Input 
                    id="edit-video_url" 
                    name="video_url" 
                    value={formData.video_url || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t('admin.description')}</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={formData.description || ''} 
                  onChange={handleInputChange} 
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">{t('admin.content')}</Label>
                <Textarea 
                  id="edit-content" 
                  name="content" 
                  value={formData.content || ''} 
                  onChange={handleInputChange} 
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t('admin.cancel')}
                </Button>
                <Button type="submit">
                  {t('admin.update')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Lecture Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.confirmDelete')}</DialogTitle>
            </DialogHeader>
            <p>
              {t('admin.confirmDeleteLecture', { lecture: selectedLecture?.title })}
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                {t('admin.cancel')}
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteLecture}>
                {t('admin.delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LecturesManagement;
