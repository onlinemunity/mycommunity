import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';  // Ensure Loader2 is imported here
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
            <Plus className="mr-2" /> {t('admin.createCourse')}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.courseTitle')}</TableHead>
              <TableHead>{t('admin.category')}</TableHead>
              <TableHead>{t('admin.level')}</TableHead>
              <TableHead>{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Loader2 className="animate-spin" />
                </TableCell>
              </TableRow>
            ) : (
              courses?.map(course => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleEdit(course)}><Edit /></Button>
                    <Button variant="outline" onClick={() => handleDelete(course)}><Trash2 /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CoursesManagement;
