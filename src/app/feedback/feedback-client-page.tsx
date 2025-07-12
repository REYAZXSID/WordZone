
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageSquare, Bug, ImageIcon, Send } from 'lucide-react';
import { cn } from '@/lib/utils';


const feedbackSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  feedback: z.string().min(10, "Feedback must be at least 10 characters.").max(1000),
});

const reportSchema = z.object({
    issueType: z.string({ required_error: "Please select an issue type."}),
    description: z.string().min(10, "Description must be at least 10 characters.").max(2000),
    email: z.string().email("Please enter a valid email.").optional().or(z.literal('')),
});

export function FeedbackClientPage() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  const feedbackForm = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 0, feedback: '' },
  });

  const reportForm = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: { issueType: undefined, description: '', email: '' },
  });

  function onFeedbackSubmit(values: z.infer<typeof feedbackSchema>) {
    console.log("Feedback submitted:", values);
    toast({
      title: 'Feedback Sent!',
      description: 'Thank you for helping us improve!',
    });
    feedbackForm.reset();
    setRating(0);
  }

  function onReportSubmit(values: z.infer<typeof reportSchema>) {
    console.log("Bug report submitted:", values);
    toast({
      title: 'Report Sent!',
      description: 'Our team will look into it. Thanks for your help!',
    });
    reportForm.reset();
  }
  
  return (
    <div className="mx-auto max-w-2xl">
        <Tabs defaultValue="feedback">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="feedback"><MessageSquare className="mr-2 h-4 w-4" />General Feedback</TabsTrigger>
                <TabsTrigger value="report"><Bug className="mr-2 h-4 w-4"/>Report a Bug</TabsTrigger>
            </TabsList>
            <TabsContent value="feedback">
                <Card>
                    <CardHeader>
                        <CardTitle>Share Your Thoughts</CardTitle>
                        <CardDescription>We'd love to hear what you think about Cryptify.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...feedbackForm}>
                            <form onSubmit={feedbackForm.handleSubmit(onFeedbackSubmit)} className="space-y-6">
                                <FormField
                                    control={feedbackForm.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>How would you rate your experience?</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    {[1,2,3,4,5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={cn(
                                                                "h-8 w-8 cursor-pointer transition-colors",
                                                                rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50"
                                                            )}
                                                            onClick={() => {
                                                                setRating(star);
                                                                field.onChange(star);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={feedbackForm.control}
                                    name="feedback"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Feedback</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Tell us what you liked or what could be better..." {...field} rows={5}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={feedbackForm.formState.isSubmitting}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Feedback
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="report">
                 <Card>
                    <CardHeader>
                        <CardTitle>Report an Issue</CardTitle>
                        <CardDescription>Spotted a bug? Let us know so we can fix it.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...reportForm}>
                            <form onSubmit={reportForm.handleSubmit(onReportSubmit)} className="space-y-6">
                                <FormField
                                    control={reportForm.control}
                                    name="issueType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type of Issue</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="ui-ux">UI/UX Problem</SelectItem>
                                                        <SelectItem value="crash">Crash or Freeze</SelectItem>
                                                        <SelectItem value="puzzle-error">Puzzle Data Error</SelectItem>
                                                        <SelectItem value="performance">Performance Issue</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={reportForm.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Detailed Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Please describe the issue in detail. What were you doing when it happened?" {...field} rows={5}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormItem>
                                    <FormLabel>Upload Screenshot (Optional)</FormLabel>
                                    <Button variant="outline" className="w-full flex items-center gap-2" type="button">
                                        <ImageIcon className="h-4 w-4" />
                                        Attach an image
                                    </Button>
                                </FormItem>
                                
                                 <FormField
                                    control={reportForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Email (Optional)</FormLabel>
                                            <FormDescription>Provide your email if you'd like us to follow up.</FormDescription>
                                            <FormControl>
                                                <Input placeholder="you@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={reportForm.formState.isSubmitting}>
                                     <Bug className="mr-2 h-4 w-4" />
                                    Submit Report
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
