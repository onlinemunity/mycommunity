
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
  description: string;
  instructor: string;
  category: string;
  level: string;
  duration: string;
  video_url: string | null;
  image: string;
};

type CourseFormData = Omit<Course, 'id'>;

const CoursesManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    instructor: '',
    category: '',
    level: 'beginner',
    duration: '2 hours',
    video_url: '',
    image: '/placeholder.svg',
  });

  // Fetch courses
  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    },
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (newCourse: CourseFormData) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([newCourse])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast({
        title: t('admin.courseCreated'),
        description: t('admin.courseCreatedDesc'),
      });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating course:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.errorCreatingCourse'),
        variant: 'destructive',
      });
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async (course: Course) => {
      const { id, ...courseData } = course;
      const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast({
        title: t('admin.courseUpdated'),
        description: t('admin.courseUpdatedDesc'),
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating course:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.errorUpdatingCourse'),
        variant: 'destructive',
      });
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast({
        title: t('admin.courseDeleted'),
        description: t('admin.courseDeletedDesc'),
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.errorDeletingCourse'),
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(formData);
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse) {
      updateCourseMutation.mutate({
        ...formData,
        id: selectedCourse.id,
      });
    }
  };

  const handleDeleteCourse = () => {
    if (selectedCourse) {
      deleteCourseMutation.mutate(selectedCourse.id);
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      category: course.category,
      level: course.level,
      duration: course.duration,
      video_url: course.video_url || '',
      image: course.image,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      category: '',
      level: 'beginner',
      duration: '2 hours',
      video_url: '',
      image: '/placeholder.svg',
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('admin.coursesManagement')}</h2>
          <Button onClick={() => {
            resetForm();
            setIsCreateDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> {t('admin.createCourse')}
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
                <TableHead>{t('admin.instructor')}</TableHead>
                <TableHead>{t('admin.category')}</TableHead>
                <TableHead>{t('admin.level')}</TableHead>
                <TableHead>{t('admin.duration')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.level}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(course)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t('admin.noCourses')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Create Course Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('admin.createCourse')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCourse} className="space-y-4 py-4">
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
                  <Label htmlFor="instructor">{t('admin.instructor')}</Label>
                  <Input 
                    id="instructor" 
                    name="instructor" 
                    value={formData.instructor} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t('admin.category')}</Label>
                  <Input 
                    id="category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">{t('admin.level')}</Label>
                  <Input 
                    id="level" 
                    name="level" 
                    value={formData.level} 
                    onChange={handleInputChange} 
                    required 
                  />
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
                  <Label htmlFor="video_url">{t('admin.videoUrl')}</Label>
                  <Input 
                    id="video_url" 
                    name="video_url" 
                    value={formData.video_url || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">{t('admin.imageUrl')}</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('admin.description')}</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows={4} 
                  required 
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

        {/* Edit Course Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('admin.editCourse')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateCourse} className="space-y-4 py-4">
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
                  <Label htmlFor="edit-instructor">{t('admin.instructor')}</Label>
                  <Input 
                    id="edit-instructor" 
                    name="instructor" 
                    value={formData.instructor} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">{t('admin.category')}</Label>
                  <Input 
                    id="edit-category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-level">{t('admin.level')}</Label>
                  <Input 
                    id="edit-level" 
                    name="level" 
                    value={formData.level} 
                    onChange={handleInputChange} 
                    required 
                  />
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
                  <Label htmlFor="edit-video_url">{t('admin.videoUrl')}</Label>
                  <Input 
                    id="edit-video_url" 
                    name="video_url" 
                    value={formData.video_url || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image">{t('admin.imageUrl')}</Label>
                  <Input 
                    id="edit-image" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">{t('admin.description')}</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows={4} 
                  required 
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

        {/* Delete Course Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.confirmDelete')}</DialogTitle>
            </DialogHeader>
            <p>
              {t('admin.confirmDeleteCourse', { course: selectedCourse?.title })}
            </p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                {t('admin.cancel')}
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteCourse}>
                {t('admin.delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CoursesManagement;
